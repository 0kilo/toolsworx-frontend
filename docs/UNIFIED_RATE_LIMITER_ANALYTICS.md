# Unified Rate Limiter + Visitor Analytics

## Overview

Single implementation that handles:
- ✅ Tiered rate limiting per visitor (by resource type)
- ✅ Visitor tracking and unique counts
- ✅ Usage analytics
- ✅ Abuse detection
- ✅ Revenue correlation

**Key Insight**: Every API call = rate limit check + analytics event. Combine them into one system!

---

## Rate Limit Tiers

Different API operations have different resource costs, so we implement **tiered rate limiting**:

### Tier 1: Low Resource Operations (10 requests/hour)
- `getCurrencyRate` - Fetches currency exchange rate from DynamoDB
- `getCryptoPrice` - Fetches crypto price from DynamoDB
- **Limit**: 10 requests per hour per visitor
- **Cost per request**: ~$0.000004

### Tier 2: High Resource Operations (3 requests/hour)
- `fileConversion` - CPU-intensive file conversion
- `mediaConversion` - Memory/CPU-intensive media processing
- `audioFilter` - CPU-intensive audio processing
- `fileFilter` - CPU-intensive image processing
- **Limit**: 3 requests per hour per visitor
- **Cost per request**: ~$0.10-0.50 (depending on file size)

**Why Tiered Limits?**
- File conversions use 50-100x more resources than DB reads
- Prevents abuse of expensive operations
- Keeps costs predictable

---

## Architecture: Single Table Design

### DynamoDB Table: `VisitorTracking`

**Why Single Table?**
- Every API call = rate limit check + analytics event
- No duplicate writes
- Lower cost (~50% reduction)
- Simpler codebase

**Table Structure**:

```typescript
interface VisitorRecord {
  // Primary Key
  pk: string;                    // VISITOR#{visitorId}#TIER#{tier}
  sk: string;                    // HOUR#{hourTimestamp}

  // Visitor identification
  visitorId: string;             // Anonymous hash
  ipHash: string;                // Hashed IP (backup identifier)

  // Rate limiting data
  tier: string;                  // 'LOW_RESOURCE' | 'HIGH_RESOURCE'
  requestCount: number;          // Requests in this time window
  maxRequests: number;           // Max allowed (10 or 3)
  windowStart: number;           // Window start timestamp
  windowEnd: number;             // Window end timestamp
  lastRequestTime: number;       // Last request timestamp

  // Tool usage tracking
  toolId: string;                // 'currency-converter' | 'file-converter' | etc
  operations: string[];          // ['USD->EUR', 'PDF->DOCX', ...]

  // Session data
  sessionId: string;             // Session identifier
  device: string;                // 'mobile' | 'desktop' | 'tablet'
  browser: string;               // Browser name
  country?: string;              // Country code (from CloudFront header)

  // Flags
  rateLimitExceeded: boolean;    // Did visitor hit rate limit?
  isAbusive: boolean;            // Flagged as potential abuse

  // TTL
  ttl: number;                   // Auto-delete after 90 days

  // GSI fields
  gsi1pk: string;                // DAY#{date} for daily aggregation
  gsi1sk: number;                // timestamp
  gsi2pk: string;                // ipHash for IP tracking
  gsi2sk: number;                // timestamp
  gsi3pk: string;                // toolId for tool analytics
  gsi3sk: number;                // timestamp
}
```

**Global Secondary Indexes**:

1. **GSI1**: `day-timestamp-index`
   - PK: `DAY#{date}` (e.g., "DAY#2025-12-02")
   - SK: `timestamp`
   - **Use case**: Daily unique visitors, daily operation counts

2. **GSI2**: `ipHash-timestamp-index`
   - PK: `ipHash`
   - SK: `timestamp`
   - **Use case**: Detect IP abuse, multi-visitor from same IP

3. **GSI3**: `toolId-timestamp-index`
   - PK: `toolId`
   - SK: `timestamp`
   - **Use case**: Tool popularity, tool-specific metrics

---

## Implementation

### 1. Visitor ID Utility (Client-Side)

**File**: `lib/utils/visitor-id.ts`

```typescript
/**
 * Generate anonymous visitor ID from browser fingerprint
 * Privacy-friendly, no cookies required
 */

interface VisitorIdentity {
  visitorId: string;
  sessionId: string;
  device: 'mobile' | 'desktop' | 'tablet';
  browser: string;
}

export class VisitorIdentification {
  private static VISITOR_ID_KEY = 'tw_visitor_id';
  private static SESSION_ID_KEY = 'tw_session_id';

  /**
   * Get or create visitor identity
   */
  static async getIdentity(): Promise<VisitorIdentity> {
    let visitorId = localStorage.getItem(this.VISITOR_ID_KEY);

    if (!visitorId) {
      visitorId = await this.generateVisitorId();
      localStorage.setItem(this.VISITOR_ID_KEY, visitorId);
    }

    let sessionId = sessionStorage.getItem(this.SESSION_ID_KEY);

    if (!sessionId) {
      sessionId = this.generateSessionId();
      sessionStorage.setItem(this.SESSION_ID_KEY, sessionId);
    }

    return {
      visitorId,
      sessionId,
      device: this.getDeviceType(),
      browser: this.getBrowser()
    };
  }

  /**
   * Generate visitor ID from browser fingerprint
   */
  private static async generateVisitorId(): Promise<string> {
    const fingerprint = {
      screen: `${screen.width}x${screen.height}`,
      timezone: new Date().getTimezoneOffset(),
      language: navigator.language,
      platform: navigator.platform,
      userAgent: navigator.userAgent
    };

    const str = JSON.stringify(fingerprint);
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex.slice(0, 32);
  }

  /**
   * Generate session ID
   */
  private static generateSessionId(): string {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Get device type
   */
  private static getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  /**
   * Get browser name
   */
  private static getBrowser(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Edge')) return 'Edge';
    return 'Other';
  }
}
```

### 2. Add GraphQL Schema Extensions

**File**: `amplify/data/resource.ts`

Add new mutations/queries for rate limit checking:

```typescript
const schema = a.schema({
  // ... existing schema

  // Rate limit check - returns whether request is allowed
  checkRateLimit: a
    .query()
    .arguments({
      visitorId: a.string().required(),
      sessionId: a.string().required(),
      tier: a.string().required(), // 'LOW_RESOURCE' | 'HIGH_RESOURCE'
      toolId: a.string().required(),
      operation: a.string(),
      device: a.string(),
      browser: a.string()
    })
    .returns(a.json())
    .authorization(allow => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        dataSource: a.ref('VisitorTracking'),
        entry: './resolvers/check-rate-limit.js'
      })
    ),

  // Get current rate limit status
  getRateLimitStatus: a
    .query()
    .arguments({
      visitorId: a.string().required(),
      tier: a.string().required()
    })
    .returns(a.json())
    .authorization(allow => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        dataSource: a.ref('VisitorTracking'),
        entry: './resolvers/get-rate-limit-status.js'
      })
    ),

  // Get daily analytics metrics
  getDailyMetrics: a
    .query()
    .arguments({
      date: a.string().required()
    })
    .returns(a.json())
    .authorization(allow => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        dataSource: a.ref('VisitorTracking'),
        entry: './resolvers/get-daily-metrics.js'
      })
    ),
});
```

### 3. AppSync Resolver: Check Rate Limit

**File**: `amplify/data/resolvers/check-rate-limit.js`

```javascript
import { util } from '@aws-appsync/utils';

/**
 * Rate limit check + visitor tracking in single operation
 *
 * Tiers:
 * - LOW_RESOURCE: 10 requests/hour (currency, crypto)
 * - HIGH_RESOURCE: 3 requests/hour (file conversions)
 */

const RATE_LIMITS = {
  'LOW_RESOURCE': 10,
  'HIGH_RESOURCE': 3
};

const HOUR_IN_MS = 60 * 60 * 1000;

export function request(ctx) {
  const {
    visitorId,
    sessionId,
    tier,
    toolId,
    operation,
    device,
    browser
  } = ctx.args;

  // Validate tier
  if (!RATE_LIMITS[tier]) {
    util.error('Invalid tier', 'InvalidTier');
  }

  const now = Date.now();
  const hourStart = Math.floor(now / HOUR_IN_MS) * HOUR_IN_MS;
  const hourEnd = hourStart + HOUR_IN_MS;

  const pk = `VISITOR#${visitorId}#TIER#${tier}`;
  const sk = `HOUR#${hourStart}`;

  // Get current hour's record
  return {
    operation: 'GetItem',
    key: {
      pk: { S: pk },
      sk: { S: sk }
    }
  };
}

export function response(ctx) {
  if (ctx.error) {
    console.error('Resolver error:', ctx.error);
    util.error(ctx.error.message, ctx.error.type);
  }

  const {
    visitorId,
    sessionId,
    tier,
    toolId,
    operation,
    device,
    browser
  } = ctx.args;

  const now = Date.now();
  const hourStart = Math.floor(now / HOUR_IN_MS) * HOUR_IN_MS;
  const hourEnd = hourStart + HOUR_IN_MS;
  const maxRequests = RATE_LIMITS[tier];

  const pk = `VISITOR#${visitorId}#TIER#${tier}`;
  const sk = `HOUR#${hourStart}`;

  // Get IP hash from request context
  const sourceIp = ctx.request.headers['x-forwarded-for'] ||
                   ctx.request.headers['x-real-ip'] ||
                   ctx.identity?.sourceIp?.[0] ||
                   'unknown';
  const ipHash = util.crypto.sha256Hex(sourceIp + 'salt');

  // Country from CloudFront header
  const country = ctx.request.headers['cloudfront-viewer-country'];

  const existingRecord = ctx.result;

  if (!existingRecord) {
    // New visitor or new hour window
    // Create initial record
    const ttl = Math.floor((now + 90 * 24 * 60 * 60 * 1000) / 1000); // 90 days
    const date = new Date(now).toISOString().split('T')[0];

    const newRecord = {
      pk: { S: pk },
      sk: { S: sk },
      visitorId: { S: visitorId },
      ipHash: { S: ipHash },
      tier: { S: tier },
      requestCount: { N: '1' },
      maxRequests: { N: maxRequests.toString() },
      windowStart: { N: hourStart.toString() },
      windowEnd: { N: hourEnd.toString() },
      lastRequestTime: { N: now.toString() },
      toolId: { S: toolId },
      operations: { L: operation ? [{ S: operation }] : [] },
      sessionId: { S: sessionId },
      device: { S: device },
      browser: { S: browser },
      country: country ? { S: country } : { NULL: true },
      rateLimitExceeded: { BOOL: false },
      isAbusive: { BOOL: false },
      ttl: { N: ttl.toString() },
      // GSI fields
      gsi1pk: { S: `DAY#${date}` },
      gsi1sk: { N: now.toString() },
      gsi2pk: { S: ipHash },
      gsi2sk: { N: now.toString() },
      gsi3pk: { S: toolId },
      gsi3sk: { N: now.toString() }
    };

    // Store the new record using a separate PutItem request
    // (We need to use ctx.stash to pass data for a pipeline resolver)
    ctx.stash.putItemRequest = {
      operation: 'PutItem',
      key: {
        pk: { S: pk },
        sk: { S: sk }
      },
      attributeValues: newRecord
    };

    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: hourEnd,
      isNewVisitor: true,
      visitorId: visitorId,
      requestCount: 1
    };
  } else {
    // Existing record - check count
    const currentCount = parseInt(existingRecord.requestCount?.N || '0');
    const newCount = currentCount + 1;

    if (currentCount >= maxRequests) {
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetTime: hourEnd,
        isNewVisitor: false,
        visitorId: visitorId,
        requestCount: currentCount
      };
    }

    // Update record with incremented count
    ctx.stash.updateItemRequest = {
      operation: 'UpdateItem',
      key: {
        pk: { S: pk },
        sk: { S: sk }
      },
      update: {
        expression: 'SET requestCount = requestCount + :inc, lastRequestTime = :now, operations = list_append(if_not_exists(operations, :empty), :operation), rateLimitExceeded = :exceeded',
        expressionValues: {
          ':inc': { N: '1' },
          ':now': { N: now.toString() },
          ':empty': { L: [] },
          ':operation': { L: operation ? [{ S: operation }] : [] },
          ':exceeded': { BOOL: newCount >= maxRequests }
        }
      }
    };

    return {
      allowed: true,
      remaining: maxRequests - newCount,
      resetTime: hourEnd,
      isNewVisitor: false,
      visitorId: visitorId,
      requestCount: newCount
    };
  }
}
```

### 4. AppSync Pipeline Resolver (for atomic updates)

Since we need to check AND update in one operation, we should use a **pipeline resolver**:

**File**: `amplify/data/resolvers/check-rate-limit-pipeline.js`

```javascript
import { util } from '@aws-appsync/utils';

/**
 * Pipeline resolver for atomic rate limit check + update
 * Function 1: Check current count
 * Function 2: Update count if allowed
 */

// Function 1: Request
export function request(ctx) {
  const { visitorId, tier } = ctx.args;

  const now = Date.now();
  const hourStart = Math.floor(now / (60 * 60 * 1000)) * (60 * 60 * 1000);

  const pk = `VISITOR#${visitorId}#TIER#${tier}`;
  const sk = `HOUR#${hourStart}`;

  return {
    operation: 'GetItem',
    key: {
      pk: { S: pk },
      sk: { S: sk }
    }
  };
}

// Function 1: Response
export function response(ctx) {
  const { visitorId, tier, toolId, operation, sessionId, device, browser } = ctx.args;

  const RATE_LIMITS = {
    'LOW_RESOURCE': 10,
    'HIGH_RESOURCE': 3
  };

  const now = Date.now();
  const hourStart = Math.floor(now / (60 * 60 * 1000)) * (60 * 60 * 1000);
  const hourEnd = hourStart + (60 * 60 * 1000);
  const maxRequests = RATE_LIMITS[tier];

  const existingRecord = ctx.result;
  const currentCount = existingRecord ? parseInt(existingRecord.requestCount?.N || '0') : 0;

  // Check if allowed
  const allowed = currentCount < maxRequests;

  if (!allowed) {
    // Rate limit exceeded - don't proceed to update
    return {
      allowed: false,
      remaining: 0,
      resetTime: hourEnd,
      requestCount: currentCount,
      visitorId
    };
  }

  // Allowed - prepare data for update function
  ctx.stash.allowed = true;
  ctx.stash.isNewRecord = !existingRecord;
  ctx.stash.currentCount = currentCount;
  ctx.stash.maxRequests = maxRequests;
  ctx.stash.hourStart = hourStart;
  ctx.stash.hourEnd = hourEnd;

  // Continue to next function in pipeline
  return { proceed: true };
}
```

**Note**: For a true atomic operation, we'd use DynamoDB's **conditional UpdateItem** with increment. Let me provide a simpler, production-ready version:

### 5. AppSync Resolver: Atomic Rate Limit Check (Production Version)

**File**: `amplify/data/resolvers/check-rate-limit.js`

```javascript
import { util } from '@aws-appsync/utils';

const RATE_LIMITS = {
  'LOW_RESOURCE': 10,
  'HIGH_RESOURCE': 3
};

export function request(ctx) {
  const { visitorId, tier, toolId, operation, sessionId, device, browser } = ctx.args;

  const now = Date.now();
  const hourStart = Math.floor(now / (60 * 60 * 1000)) * (60 * 60 * 1000);
  const hourEnd = hourStart + (60 * 60 * 1000);
  const maxRequests = RATE_LIMITS[tier];

  const pk = `VISITOR#${visitorId}#TIER#${tier}`;
  const sk = `HOUR#${hourStart}`;

  const sourceIp = ctx.request.headers['x-forwarded-for'] ||
                   ctx.request.headers['x-real-ip'] || 'unknown';
  const ipHash = util.crypto.sha256Hex(sourceIp + 'salt_tw');

  const country = ctx.request.headers['cloudfront-viewer-country'];
  const date = new Date(now).toISOString().split('T')[0];
  const ttl = Math.floor((now + 90 * 24 * 60 * 60 * 1000) / 1000);

  // Use UpdateItem with ADD for atomic increment
  // If item doesn't exist, DynamoDB will create it with count=1
  return {
    operation: 'UpdateItem',
    key: {
      pk: { S: pk },
      sk: { S: sk }
    },
    update: {
      expression: `
        SET visitorId = if_not_exists(visitorId, :visitorId),
            ipHash = if_not_exists(ipHash, :ipHash),
            tier = if_not_exists(tier, :tier),
            maxRequests = if_not_exists(maxRequests, :maxRequests),
            windowStart = if_not_exists(windowStart, :windowStart),
            windowEnd = if_not_exists(windowEnd, :windowEnd),
            toolId = :toolId,
            sessionId = :sessionId,
            device = :device,
            browser = :browser,
            country = :country,
            lastRequestTime = :now,
            ttl = if_not_exists(ttl, :ttl),
            gsi1pk = if_not_exists(gsi1pk, :gsi1pk),
            gsi1sk = if_not_exists(gsi1sk, :gsi1sk),
            gsi2pk = if_not_exists(gsi2pk, :gsi2pk),
            gsi2sk = if_not_exists(gsi2sk, :gsi2sk),
            gsi3pk = if_not_exists(gsi3pk, :gsi3pk),
            gsi3sk = if_not_exists(gsi3sk, :gsi3sk),
            rateLimitExceeded = :exceeded,
            operations = list_append(if_not_exists(operations, :emptyList), :operation)
        ADD requestCount :inc
      `,
      expressionValues: {
        ':visitorId': { S: visitorId },
        ':ipHash': { S: ipHash },
        ':tier': { S: tier },
        ':maxRequests': { N: maxRequests.toString() },
        ':windowStart': { N: hourStart.toString() },
        ':windowEnd': { N: hourEnd.toString() },
        ':toolId': { S: toolId },
        ':sessionId': { S: sessionId },
        ':device': { S: device || 'unknown' },
        ':browser': { S: browser || 'unknown' },
        ':country': { S: country || 'unknown' },
        ':now': { N: now.toString() },
        ':ttl': { N: ttl.toString() },
        ':gsi1pk': { S: `DAY#${date}` },
        ':gsi1sk': { N: now.toString() },
        ':gsi2pk': { S: ipHash },
        ':gsi2sk': { N: now.toString() },
        ':gsi3pk': { S: toolId },
        ':gsi3sk': { N: now.toString() },
        ':inc': { N: '1' },
        ':emptyList': { L: [] },
        ':operation': { L: operation ? [{ S: operation }] : [] },
        ':exceeded': { BOOL: false } // Will be updated if needed
      }
    },
    // Condition: Only succeed if count < maxRequests OR item doesn't exist
    condition: {
      expression: 'attribute_not_exists(pk) OR requestCount < :maxRequests',
      expressionValues: {
        ':maxRequests': { N: maxRequests.toString() }
      }
    }
  };
}

export function response(ctx) {
  if (ctx.error) {
    // Condition failed = rate limit exceeded
    if (ctx.error.type === 'DynamoDB:ConditionalCheckFailedException') {
      const { tier } = ctx.args;
      const maxRequests = RATE_LIMITS[tier];
      const hourEnd = Math.floor(Date.now() / (60 * 60 * 1000)) * (60 * 60 * 1000) + (60 * 60 * 1000);

      return {
        allowed: false,
        remaining: 0,
        resetTime: hourEnd,
        requestCount: maxRequests,
        visitorId: ctx.args.visitorId
      };
    }

    // Other errors
    console.error('Rate limit check error:', ctx.error);
    util.error(ctx.error.message, ctx.error.type);
  }

  const item = ctx.result;
  const requestCount = parseInt(item.requestCount?.N || '1');
  const maxRequests = parseInt(item.maxRequests?.N || RATE_LIMITS[ctx.args.tier]);
  const remaining = maxRequests - requestCount;
  const hourEnd = parseInt(item.windowEnd?.N || '0');

  return {
    allowed: true,
    remaining: Math.max(0, remaining),
    resetTime: hourEnd,
    requestCount: requestCount,
    visitorId: ctx.args.visitorId,
    isNewVisitor: requestCount === 1
  };
}
```

### 6. AppSync Resolver: Get Rate Limit Status

**File**: `amplify/data/resolvers/get-rate-limit-status.js`

```javascript
import { util } from '@aws-appsync/utils';

const RATE_LIMITS = {
  'LOW_RESOURCE': 10,
  'HIGH_RESOURCE': 3
};

export function request(ctx) {
  const { visitorId, tier } = ctx.args;

  const now = Date.now();
  const hourStart = Math.floor(now / (60 * 60 * 1000)) * (60 * 60 * 1000);

  const pk = `VISITOR#${visitorId}#TIER#${tier}`;
  const sk = `HOUR#${hourStart}`;

  return {
    operation: 'GetItem',
    key: {
      pk: { S: pk },
      sk: { S: sk }
    }
  };
}

export function response(ctx) {
  if (ctx.error) {
    console.error('Get status error:', ctx.error);
    util.error(ctx.error.message, ctx.error.type);
  }

  const { tier } = ctx.args;
  const maxRequests = RATE_LIMITS[tier];
  const now = Date.now();
  const hourEnd = Math.floor(now / (60 * 60 * 1000)) * (60 * 60 * 1000) + (60 * 60 * 1000);

  if (!ctx.result) {
    // No record = no requests yet
    return {
      remaining: maxRequests,
      resetTime: hourEnd,
      requestCount: 0
    };
  }

  const item = ctx.result;
  const requestCount = parseInt(item.requestCount?.N || '0');
  const remaining = Math.max(0, maxRequests - requestCount);

  return {
    remaining,
    resetTime: parseInt(item.windowEnd?.N || hourEnd.toString()),
    requestCount
  };
}
```

### 7. AppSync Resolver: Get Daily Metrics

**File**: `amplify/data/resolvers/get-daily-metrics.js`

```javascript
import { util } from '@aws-appsync/utils';

export function request(ctx) {
  const { date } = ctx.args; // Format: "2025-12-02"

  return {
    operation: 'Query',
    index: 'day-timestamp-index',
    query: {
      expression: 'gsi1pk = :day',
      expressionValues: {
        ':day': { S: `DAY#${date}` }
      }
    },
    limit: 1000 // Adjust based on expected daily volume
  };
}

export function response(ctx) {
  if (ctx.error) {
    console.error('Metrics error:', ctx.error);
    util.error(ctx.error.message, ctx.error.type);
  }

  const items = ctx.result.items || [];

  if (items.length === 0) {
    return {
      date: ctx.args.date,
      uniqueVisitors: 0,
      totalRequests: 0,
      lowResourceRequests: 0,
      highResourceRequests: 0,
      rateLimitHits: 0,
      deviceBreakdown: {},
      topTools: []
    };
  }

  // Aggregate metrics
  const uniqueVisitors = new Set();
  let totalRequests = 0;
  let lowResourceRequests = 0;
  let highResourceRequests = 0;
  let rateLimitHits = 0;
  const deviceCounts = {};
  const toolCounts = {};

  items.forEach(item => {
    const visitorId = item.visitorId?.S;
    if (visitorId) uniqueVisitors.add(visitorId);

    const requestCount = parseInt(item.requestCount?.N || '0');
    totalRequests += requestCount;

    const tier = item.tier?.S;
    if (tier === 'LOW_RESOURCE') {
      lowResourceRequests += requestCount;
    } else if (tier === 'HIGH_RESOURCE') {
      highResourceRequests += requestCount;
    }

    if (item.rateLimitExceeded?.BOOL) {
      rateLimitHits++;
    }

    const device = item.device?.S || 'unknown';
    deviceCounts[device] = (deviceCounts[device] || 0) + 1;

    const tool = item.toolId?.S || 'unknown';
    toolCounts[tool] = (toolCounts[tool] || 0) + requestCount;
  });

  // Format top tools
  const topTools = Object.entries(toolCounts)
    .map(([tool, count]) => ({ tool, requests: count }))
    .sort((a, b) => b.requests - a.requests)
    .slice(0, 10);

  return {
    date: ctx.args.date,
    uniqueVisitors: uniqueVisitors.size,
    totalRequests,
    lowResourceRequests,
    highResourceRequests,
    rateLimitHits,
    rateLimitHitRate: totalRequests > 0
      ? ((rateLimitHits / totalRequests) * 100).toFixed(2) + '%'
      : '0%',
    deviceBreakdown: deviceCounts,
    topTools
  };
}
```

### 8. Frontend Integration with Currency Converter

**File**: `app/unit-conversions/currency/page.tsx`

```typescript
"use client"

import { useState, useEffect } from "react"
import { amplifyApiClient } from "@/lib/services/amplify-client"
import { VisitorIdentification } from "@/lib/utils/visitor-id"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function CurrencyConverterPage() {
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("EUR")
  const [fromValue, setFromValue] = useState("")
  const [toValue, setToValue] = useState("")
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1 })
  const [loading, setLoading] = useState(false)
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false)
  const [rateLimitResetTime, setRateLimitResetTime] = useState<Date | null>(null)
  const [remaining, setRemaining] = useState(10)

  const fetchRate = async (currency: string) => {
    if (currency === 'USD' || rates[currency]) return

    setLoading(true)

    try {
      // Get visitor identity
      const identity = await VisitorIdentification.getIdentity()

      // Check rate limit
      const rateLimitCheck = await amplifyApiClient.checkRateLimit({
        visitorId: identity.visitorId,
        sessionId: identity.sessionId,
        tier: 'LOW_RESOURCE',
        toolId: 'currency-converter',
        operation: `${fromCurrency}->${toCurrency}`,
        device: identity.device,
        browser: identity.browser
      })

      setRemaining(rateLimitCheck.remaining)

      if (!rateLimitCheck.allowed) {
        setRateLimitExceeded(true)
        setRateLimitResetTime(new Date(rateLimitCheck.resetTime))
        return
      }

      setRateLimitExceeded(false)

      // Fetch currency rate
      const data = await amplifyApiClient.getCurrencyRate(currency)
      if (data && data.price) {
        setRates(prev => ({ ...prev, [currency]: data.price }))
      }
    } catch (error) {
      console.error(`Failed to fetch ${currency}:`, error)
    } finally {
      setLoading(false)
    }
  }

  // ... rest of component
}
```

### 9. Update Amplify Client

**File**: `lib/services/amplify-client.ts`

Add methods for rate limiting:

```typescript
export class AmplifyApiClient {
  // ... existing methods

  /**
   * Check rate limit for current user
   */
  async checkRateLimit(params: {
    visitorId: string;
    sessionId: string;
    tier: 'LOW_RESOURCE' | 'HIGH_RESOURCE';
    toolId: string;
    operation?: string;
    device: string;
    browser: string;
  }): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
    requestCount: number;
    visitorId: string;
  }> {
    const { data, errors } = await client.queries.checkRateLimit(params, {
      authMode: 'apiKey'
    })

    if (errors && errors.length > 0) {
      console.error('Rate limit check errors:', errors)
      throw new Error(`Failed to check rate limit: ${errors[0].message}`)
    }

    if (!data) {
      throw new Error('No response from rate limit check')
    }

    let responseData = data as any
    if (typeof responseData === 'string') {
      responseData = JSON.parse(responseData)
    }

    return responseData
  }

  /**
   * Get current rate limit status
   */
  async getRateLimitStatus(visitorId: string, tier: 'LOW_RESOURCE' | 'HIGH_RESOURCE'): Promise<{
    remaining: number;
    resetTime: number;
    requestCount: number;
  }> {
    const { data, errors } = await client.queries.getRateLimitStatus({
      visitorId,
      tier
    }, {
      authMode: 'apiKey'
    })

    if (errors && errors.length > 0) {
      throw new Error(`Failed to get rate limit status: ${errors[0].message}`)
    }

    let responseData = data as any
    if (typeof responseData === 'string') {
      responseData = JSON.parse(responseData)
    }

    return responseData
  }
}

export const amplifyApiClient = new AmplifyApiClient()
```

### 10. Add VisitorTracking Table to Backend

**File**: `amplify/backend.ts`

```typescript
// Create VisitorTracking DynamoDB table
const visitorTrackingTable = new dynamodb.Table(dataStack, 'VisitorTracking', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
  billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  timeToLiveAttribute: 'ttl',
  removalPolicy: RemovalPolicy.RETAIN, // Keep data even if stack deleted
});

// GSI1: Daily aggregation
visitorTrackingTable.addGlobalSecondaryIndex({
  indexName: 'day-timestamp-index',
  partitionKey: { name: 'gsi1pk', type: dynamodb.AttributeType.STRING },
  sortKey: { name: 'gsi1sk', type: dynamodb.AttributeType.NUMBER },
  projectionType: dynamodb.ProjectionType.ALL
});

// GSI2: IP tracking
visitorTrackingTable.addGlobalSecondaryIndex({
  indexName: 'ipHash-timestamp-index',
  partitionKey: { name: 'gsi2pk', type: dynamodb.AttributeType.STRING },
  sortKey: { name: 'gsi2sk', type: dynamodb.AttributeType.NUMBER },
  projectionType: dynamodb.ProjectionType.ALL
});

// GSI3: Tool analytics
visitorTrackingTable.addGlobalSecondaryIndex({
  indexName: 'toolId-timestamp-index',
  partitionKey: { name: 'gsi3pk', type: dynamodb.AttributeType.STRING },
  sortKey: { name: 'gsi3sk', type: dynamodb.AttributeType.NUMBER },
  projectionType: dynamodb.ProjectionType.ALL
});
```

---

## Cost Analysis

### With Tiered Rate Limits (1,000 daily users)

**Assumptions**:
- 70% use low-resource tools (7 requests/day avg) = 4,900 requests/day
- 30% use high-resource tools (2 requests/day avg) = 600 requests/day
- Total: 5,500 requests/day = 165,000 requests/month

**DynamoDB Costs**:
- **Writes** (rate limit checks): 165,000 writes/month × $1.25 per million = **$0.21/month**
- **Reads** (status checks): ~50,000 reads/month × $0.25 per million = **$0.01/month**
- **Storage**: ~30MB × $0.25/GB = **$0.01/month**

**Total: ~$0.23/month**

**Comparison to previous estimate**: 50% cheaper due to tiered limits reducing high-resource requests!

---

## Benefits of Tiered System

✅ **Cost Control**: High-resource operations limited to 3/hour
✅ **Better UX**: Low-resource tools get higher limit (10/hour)
✅ **Abuse Prevention**: Heavy operations can't be spammed
✅ **Predictable Costs**: File conversions capped at 72/day per visitor
✅ **Analytics**: Track which tools are most expensive

---

## Summary

**What Changed**:
1. ✅ Tiered rate limits (10/hour low-resource, 3/hour high-resource)
2. ✅ AppSync resolvers instead of API routes
3. ✅ Atomic DynamoDB updates with conditional expressions
4. ✅ Simpler frontend (no API routes needed)
5. ✅ Lower costs (~$0.23/month)

**AppSync Benefits**:
- Direct DynamoDB access (no Lambda overhead)
- Atomic operations with conditions
- Built-in auth via API key
- Automatic type conversion
- Better performance

**Rate Limit Examples**:
- Currency conversion: 10 requests/hour ✅
- Crypto prices: 10 requests/hour ✅
- PDF → Word: 3 requests/hour ✅
- Image filters: 3 requests/hour ✅

Ready to implement!
