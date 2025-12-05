// Shared rate limiter utility for Lambda functions
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const RATE_LIMIT_TABLE = process.env.RATE_LIMIT_TABLE || 'RateLimitTable';
const DAILY_LIMIT = 3;
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export async function checkRateLimit(sessionId: string, toolId: string): Promise<RateLimitResult> {
  const key = `${sessionId}:${toolId}`;
  const now = Date.now();

  try {
    // Get current usage
    const result = await docClient.send(new GetCommand({
      TableName: RATE_LIMIT_TABLE,
      Key: { id: key }
    }));

    if (!result.Item) {
      // First use
      return { allowed: true, remaining: DAILY_LIMIT - 1, resetAt: now + WINDOW_MS };
    }

    const { count, resetAt } = result.Item;

    // Check if window expired
    if (now > resetAt) {
      // Reset window
      return { allowed: true, remaining: DAILY_LIMIT - 1, resetAt: now + WINDOW_MS };
    }

    // Check if limit exceeded
    if (count >= DAILY_LIMIT) {
      return { allowed: false, remaining: 0, resetAt };
    }

    return { allowed: true, remaining: DAILY_LIMIT - count - 1, resetAt };
  } catch (error) {
    console.error('Rate limit check error:', error);
    // Fail open - allow request if DynamoDB is down
    return { allowed: true, remaining: DAILY_LIMIT, resetAt: now + WINDOW_MS };
  }
}

export async function incrementRateLimit(sessionId: string, toolId: string): Promise<void> {
  const key = `${sessionId}:${toolId}`;
  const now = Date.now();

  try {
    const result = await docClient.send(new GetCommand({
      TableName: RATE_LIMIT_TABLE,
      Key: { id: key }
    }));

    let count = 1;
    let resetAt = now + WINDOW_MS;

    if (result.Item) {
      if (now > result.Item.resetAt) {
        // Reset window
        count = 1;
        resetAt = now + WINDOW_MS;
      } else {
        // Increment count
        count = result.Item.count + 1;
        resetAt = result.Item.resetAt;
      }
    }

    await docClient.send(new PutCommand({
      TableName: RATE_LIMIT_TABLE,
      Item: {
        id: key,
        sessionId,
        toolId,
        count,
        resetAt,
        updatedAt: now,
        ttl: Math.floor((resetAt + WINDOW_MS) / 1000) // Auto-delete after 48 hours
      }
    }));
  } catch (error) {
    console.error('Rate limit increment error:', error);
    // Don't throw - allow request to proceed
  }
}
