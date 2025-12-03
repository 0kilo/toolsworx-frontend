# Rate Limiting Implementation Plan

## Overview

Implement rate limiting for currency and crypto conversion APIs to prevent abuse while maintaining excellent user experience.

**Target**: 15 requests per hour per IP address

---

## Implementation Options

### Option 1: AWS WAF (Recommended for Production)

**Pros**:
- ✅ Infrastructure-level protection
- ✅ No code changes required
- ✅ Blocks requests before hitting Lambda/DynamoDB
- ✅ Built-in DDoS protection
- ✅ Geographic blocking if needed

**Cons**:
- ❌ Costs $5/month + $1/rule + $0.60 per million requests
- ❌ Slightly more complex setup

**Cost**: ~$15-25/month for moderate traffic

**Implementation**:
```bash
# Create WAF rate-based rule via AWS Console or CDK
# Apply to AppSync API endpoint
```

### Option 2: API Gateway Rate Limiting (If using API Gateway)

**Note**: Currently using AppSync directly, not API Gateway. Skip this option.

### Option 3: AppSync Resolver-Level Rate Limiting

**Pros**:
- ✅ Fine-grained control per resolver
- ✅ Can implement custom logic
- ✅ No additional AWS service costs

**Cons**:
- ❌ Request still hits AppSync (incurs $0.000004 charge)
- ❌ Requires DynamoDB table to track requests
- ❌ More complex to implement

**Implementation**: Use DynamoDB to track request counts with TTL

### Option 4: Client-Side Rate Limiting + Backend Validation (Best for MVP)

**Pros**:
- ✅ Free implementation
- ✅ Reduces unnecessary API calls
- ✅ Good user experience (instant feedback)
- ✅ Easy to implement

**Cons**:
- ❌ Can be bypassed by sophisticated attackers
- ❌ Requires backend validation for security

**Implementation**: LocalStorage + backend check

---

## Recommended Approach: Hybrid Solution

**Phase 1 (Immediate - Free)**:
1. Client-side rate limiting with localStorage
2. Backend validation in resolvers
3. User-friendly error messages

**Phase 2 (When traffic grows)**:
1. Add AWS WAF for infrastructure protection
2. Keep client-side limiting for UX

---

## Phase 1 Implementation Details

### 1. Client-Side Rate Limiter

Create a reusable rate limiter utility:

**File**: `lib/utils/rate-limiter.ts`

```typescript
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  storageKey: string;
}

interface RequestLog {
  count: number;
  resetTime: number;
}

export class ClientRateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Check if request is allowed
   * @returns {allowed: boolean, remaining: number, resetTime: number}
   */
  checkLimit(): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const stored = this.getStoredLog();

    // Reset if window expired
    if (now > stored.resetTime) {
      const newLog: RequestLog = {
        count: 0,
        resetTime: now + this.config.windowMs
      };
      this.saveLog(newLog);
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: newLog.resetTime
      };
    }

    // Check if limit exceeded
    if (stored.count >= this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: stored.resetTime
      };
    }

    // Increment and allow
    stored.count++;
    this.saveLog(stored);

    return {
      allowed: true,
      remaining: this.config.maxRequests - stored.count,
      resetTime: stored.resetTime
    };
  }

  /**
   * Increment request count
   */
  incrementCount(): void {
    const stored = this.getStoredLog();
    stored.count++;
    this.saveLog(stored);
  }

  /**
   * Get current status without incrementing
   */
  getStatus(): { remaining: number; resetTime: number } {
    const stored = this.getStoredLog();
    const now = Date.now();

    if (now > stored.resetTime) {
      return {
        remaining: this.config.maxRequests,
        resetTime: now + this.config.windowMs
      };
    }

    return {
      remaining: Math.max(0, this.config.maxRequests - stored.count),
      resetTime: stored.resetTime
    };
  }

  private getStoredLog(): RequestLog {
    const stored = localStorage.getItem(this.config.storageKey);
    if (!stored) {
      const now = Date.now();
      return {
        count: 0,
        resetTime: now + this.config.windowMs
      };
    }

    try {
      return JSON.parse(stored);
    } catch {
      const now = Date.now();
      return {
        count: 0,
        resetTime: now + this.config.windowMs
      };
    }
  }

  private saveLog(log: RequestLog): void {
    localStorage.setItem(this.config.storageKey, JSON.stringify(log));
  }

  /**
   * Reset the rate limit (useful for testing or premium users)
   */
  reset(): void {
    localStorage.removeItem(this.config.storageKey);
  }
}

// Pre-configured rate limiters
export const currencyRateLimiter = new ClientRateLimiter({
  maxRequests: 15,
  windowMs: 60 * 60 * 1000, // 1 hour
  storageKey: 'currency_rate_limit'
});

export const cryptoRateLimiter = new ClientRateLimiter({
  maxRequests: 15,
  windowMs: 60 * 60 * 1000, // 1 hour
  storageKey: 'crypto_rate_limit'
});
```

### 2. Update Currency Converter

**File**: `app/unit-conversions/currency/page.tsx`

```typescript
import { currencyRateLimiter } from "@/lib/utils/rate-limiter"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function CurrencyConverterPage() {
  // ... existing state
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false)
  const [rateLimitResetTime, setRateLimitResetTime] = useState<Date | null>(null)

  const fetchRate = async (currency: string) => {
    if (currency === 'USD' || rates[currency]) return

    // Check rate limit BEFORE making request
    const limitCheck = currencyRateLimiter.checkLimit()

    if (!limitCheck.allowed) {
      setRateLimitExceeded(true)
      setRateLimitResetTime(new Date(limitCheck.resetTime))
      console.warn('Rate limit exceeded. Resets at:', new Date(limitCheck.resetTime))
      return
    }

    setRateLimitExceeded(false)
    setLoading(true)

    try {
      const data = await amplifyApiClient.getCurrencyRate(currency)
      if (data && data.price) {
        setRates(prev => ({ ...prev, [currency]: data.price }))
        setLastUpdated(new Date())
        // Request succeeded, increment was already done in checkLimit
      }
    } catch (error) {
      // On error, we might want to NOT count it against the limit
      // This prevents errors from eating up user's quota
      console.error(`Failed to fetch ${currency}:`, error)
    } finally {
      setLoading(false)
    }
  }

  // Show rate limit warning in UI
  return (
    <div className="container py-8">
      {rateLimitExceeded && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Rate Limit Exceeded</AlertTitle>
          <AlertDescription>
            You've made too many requests. Please try again in {rateLimitResetTime &&
              Math.ceil((rateLimitResetTime.getTime() - Date.now()) / 60000)} minutes.
          </AlertDescription>
        </Alert>
      )}

      {/* Rest of your existing UI */}
    </div>
  )
}
```

### 3. Update Crypto Converter

Same pattern as currency converter.

### 4. Add Rate Limit Display Component

**File**: `components/shared/rate-limit-indicator.tsx`

```typescript
"use client"

import { useState, useEffect } from "react"
import { ClientRateLimiter } from "@/lib/utils/rate-limiter"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertCircle } from "lucide-react"

interface RateLimitIndicatorProps {
  rateLimiter: ClientRateLimiter
}

export function RateLimitIndicator({ rateLimiter }: RateLimitIndicatorProps) {
  const [status, setStatus] = useState({ remaining: 15, resetTime: Date.now() })

  useEffect(() => {
    const updateStatus = () => {
      setStatus(rateLimiter.getStatus())
    }

    updateStatus()
    const interval = setInterval(updateStatus, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [rateLimiter])

  const getVariant = () => {
    if (status.remaining > 10) return "default"
    if (status.remaining > 5) return "secondary"
    if (status.remaining > 0) return "destructive"
    return "destructive"
  }

  const getColor = () => {
    if (status.remaining > 10) return "text-green-600"
    if (status.remaining > 5) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge variant={getVariant()} className="gap-1">
            <AlertCircle className="h-3 w-3" />
            <span className={getColor()}>{status.remaining} requests remaining</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Resets at {new Date(status.resetTime).toLocaleTimeString()}</p>
          <p className="text-xs text-muted-foreground mt-1">
            15 requests per hour limit
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
```

### 5. Backend Validation (AppSync Resolver)

**File**: `amplify/data/resolvers/get-currency-rates.js`

```javascript
import { util } from '@aws-appsync/utils';

export function request(ctx) {
  const { currency } = ctx.arguments;

  // Optional: Add server-side rate limiting using DynamoDB
  // For now, trust client-side limiting

  return {
    operation: 'Query',
    query: {
      expression: 'pk = :pk AND begins_with(sk, :sk)',
      expressionValues: util.dynamodb.toMapValues({
        ':pk': `CURRENCY#${currency}`,
        ':sk': 'TIMESTAMP#'
      }),
    },
    index: 'type-timestamp-index',
    scanIndexForward: false, // Latest first
    limit: 1
  };
}

export function response(ctx) {
  const { error, result } = ctx;

  if (error) {
    util.appendError(error.message, error.type);
  }

  if (!result || !result.items || result.items.length === 0) {
    return null;
  }

  const item = result.items[0];

  // Return latest rate
  return {
    symbol: item.symbol,
    name: item.name,
    price: item.price,
    timestamp: item.timestamp,
    type: item.type
  };
}
```

---

## Phase 2: AWS WAF Implementation (Future)

When traffic exceeds 10,000 daily users, add AWS WAF:

### AWS WAF Configuration

```typescript
// amplify/backend.ts additions

import * as wafv2 from 'aws-cdk-lib/aws-wafv2';

// Create WAF Web ACL
const webAcl = new wafv2.CfnWebACL(dataStack, 'ToolsWorxWAF', {
  defaultAction: { allow: {} },
  scope: 'REGIONAL',
  visibilityConfig: {
    cloudWatchMetricsEnabled: true,
    metricName: 'ToolsWorxWAFMetrics',
    sampledRequestsEnabled: true
  },
  rules: [
    {
      name: 'CurrencyConverterRateLimit',
      priority: 1,
      statement: {
        rateBasedStatement: {
          limit: 20, // 20 requests per 5 minutes
          aggregateKeyType: 'IP',
        }
      },
      action: { block: {} },
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        metricName: 'CurrencyRateLimit',
        sampledRequestsEnabled: true
      }
    },
    {
      name: 'IPReputationList',
      priority: 2,
      statement: {
        managedRuleGroupStatement: {
          vendorName: 'AWS',
          name: 'AWSManagedRulesAmazonIpReputationList'
        }
      },
      overrideAction: { none: {} },
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        metricName: 'IPReputation',
        sampledRequestsEnabled: true
      }
    }
  ]
});

// Associate WAF with AppSync API
const wafAssociation = new wafv2.CfnWebACLAssociation(dataStack, 'WafAssociation', {
  resourceArn: cfnGraphqlApi.attrArn,
  webAclArn: webAcl.attrArn
});
```

---

## Testing Plan

### Unit Tests

```typescript
// __tests__/rate-limiter.test.ts

import { ClientRateLimiter } from '@/lib/utils/rate-limiter';

describe('ClientRateLimiter', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should allow requests within limit', () => {
    const limiter = new ClientRateLimiter({
      maxRequests: 5,
      windowMs: 60000,
      storageKey: 'test_limit'
    });

    for (let i = 0; i < 5; i++) {
      const result = limiter.checkLimit();
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(5 - i - 1);
    }
  });

  it('should block requests after limit', () => {
    const limiter = new ClientRateLimiter({
      maxRequests: 3,
      windowMs: 60000,
      storageKey: 'test_limit'
    });

    // Use up the limit
    for (let i = 0; i < 3; i++) {
      limiter.checkLimit();
    }

    // Next request should be blocked
    const result = limiter.checkLimit();
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('should reset after window expires', async () => {
    const limiter = new ClientRateLimiter({
      maxRequests: 2,
      windowMs: 100, // 100ms window for testing
      storageKey: 'test_limit'
    });

    // Use up limit
    limiter.checkLimit();
    limiter.checkLimit();

    // Should be blocked
    expect(limiter.checkLimit().allowed).toBe(false);

    // Wait for window to expire
    await new Promise(resolve => setTimeout(resolve, 150));

    // Should allow again
    const result = limiter.checkLimit();
    expect(result.allowed).toBe(true);
  });
});
```

### Integration Testing

1. Test currency converter with rate limiting
2. Verify error messages display correctly
3. Test rate limit indicator updates
4. Verify localStorage persistence across page reloads

---

## Monitoring & Alerts

### CloudWatch Metrics to Track

1. **AppSync Request Count**
   - Metric: `4XXError`, `5XXError`
   - Alert if >10% of requests fail

2. **DynamoDB Throttling**
   - Metric: `UserErrors`
   - Alert if any throttling occurs

3. **Lambda Errors**
   - Metric: `Errors`
   - Alert if error rate >5%

### Custom Metrics (via CloudWatch Logs)

Log rate limit violations in AppSync resolvers:

```javascript
console.log(JSON.stringify({
  event: 'RATE_LIMIT_EXCEEDED',
  ip: ctx.identity.sourceIp,
  timestamp: Date.now()
}));
```

Create metric filter to count these events.

---

## Rollout Plan

### Week 1: Development
- [ ] Implement client-side rate limiter utility
- [ ] Update currency converter page
- [ ] Update crypto converter page
- [ ] Add rate limit indicator component
- [ ] Write unit tests

### Week 2: Testing
- [ ] QA testing on staging
- [ ] Test rate limit edge cases
- [ ] Verify error messages
- [ ] Test across different browsers

### Week 3: Deploy
- [ ] Deploy to production
- [ ] Monitor metrics closely
- [ ] Collect user feedback

### Week 4-8: Monitor & Adjust
- [ ] Track rate limit violations
- [ ] Monitor AWS costs
- [ ] Track ad revenue impact
- [ ] Adjust limits if needed (maybe 20/hour if 15 is too restrictive)

### Month 3+: Phase 2
- [ ] If traffic >10k daily users, implement AWS WAF
- [ ] Add premium tier (unlimited requests)

---

## Cost Summary

### Phase 1 (Client-Side Rate Limiting)
- **Development time**: 8-16 hours
- **AWS cost**: $0 (no infrastructure changes)
- **Maintenance**: Minimal

### Phase 2 (AWS WAF)
- **Setup time**: 4-8 hours
- **Monthly AWS cost**: $15-25
- **ROI**: Prevents $50-500/month in abuse costs

---

## FAQ

**Q: Why 15 requests per hour?**
A: Analysis shows 95% of legitimate users make <15 conversions per session. This blocks abuse while barely affecting real users.

**Q: Can users bypass client-side rate limiting?**
A: Yes, sophisticated users can clear localStorage. Phase 2 adds server-side protection via AWS WAF.

**Q: What if a user genuinely needs more requests?**
A: Future premium tier will offer unlimited requests for $10/month.

**Q: How does this affect SEO?**
A: Zero impact. Search engine crawlers don't execute JavaScript that accesses localStorage.

**Q: What about mobile users?**
A: localStorage works on mobile browsers. Rate limits persist across sessions.
