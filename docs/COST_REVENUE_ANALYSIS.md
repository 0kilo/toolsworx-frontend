# Cost & Revenue Analysis - TOOLS WORX

## Executive Summary

**Goal**: Determine optimal rate limiting to prevent cost overruns while maintaining good user experience and profitability.

**Recommendation**: **15-20 requests per IP per hour** for currency/crypto converters, with dynamic adjustments based on revenue metrics.

---

## 1. AWS Infrastructure Costs

### Current Setup Analysis

#### **Amplify Hosting (Frontend)**
- **Build minutes**: ~5-10 minutes/build
  - Cost: $0.01/minute = **$0.05-0.10 per build**
- **Hosting**:
  - First 5GB stored: Free
  - First 15GB served: Free
  - Beyond free tier: $0.15/GB served
  - **Estimated**: $5-15/month for moderate traffic (50GB-100GB served)

#### **Lambda Functions**

1. **rates-fetcher** (Background job)
   - Runs: Every 30 minutes = 48 times/day = 1,440/month
   - Duration: ~5 seconds (fetching from ExchangeRate + CoinGecko APIs)
   - Memory: 128MB (default)
   - **Cost per invocation**: $0.0000002 (compute) = **$0.29/month**
   - **External API costs**: FREE (within API limits)

2. **File/Media Conversion Functions** (Not related to currency/crypto)
   - Memory: 1024MB
   - Timeout: 300s
   - These are more expensive but unrelated to rate limiting discussion

3. **AppSync Resolvers** (get-currency-rates.js, get-crypto-prices.js)
   - **DynamoDB read operations**: $0.25 per million reads (on-demand)
   - Each currency/crypto lookup = 1-2 DynamoDB reads
   - **Cost per query**: ~$0.0000005

#### **DynamoDB (MarketRate Table)**
- **Storage**: ~1MB for all currency + crypto data
  - Cost: $0.25/GB/month = **~$0.01/month**
- **Read operations** (on-demand pricing):
  - $0.25 per million read request units
  - Each currency/crypto query = 1 read = **$0.00000025**
- **Write operations**:
  - Rates fetcher writes ~180 items every 30 min (currency rates + crypto)
  - 1,440 executions/month × 180 writes = 259,200 writes/month
  - $1.25 per million writes = **$0.32/month**

#### **AppSync API (GraphQL)**
- **Query/Mutation requests**: $4.00 per million
- Each currency/crypto conversion = 1 query
- **Cost per request**: $0.000004

#### **CloudWatch Logs**
- **Log storage**: $0.50/GB
- **Estimated**: $1-3/month for all logging

### **Total Monthly AWS Infrastructure Costs**

| Component | Cost |
|-----------|------|
| Amplify Hosting | $5-15 |
| Lambda (rates-fetcher) | $0.29 |
| DynamoDB Storage | $0.01 |
| DynamoDB Writes | $0.32 |
| CloudWatch Logs | $2 |
| **Base Cost (No Traffic)** | **~$8-18/month** |

---

## 2. AWS Costs Per User Request

### Currency/Crypto Conversion Request Breakdown

Each user request to convert currency/crypto involves:

1. **AppSync API request**: $0.000004
2. **DynamoDB read** (1 currency rate): $0.00000025
3. **Data transfer**: Negligible (< 1KB response)

**Total cost per conversion request: ~$0.00000425** (~$4.25 per million requests)

### Usage Scenarios

| Daily Active Users | Requests/User/Day | Total Daily Requests | Monthly Cost | Annual Cost |
|-------------------|-------------------|---------------------|--------------|-------------|
| 100 | 10 | 1,000 | $1.28 | $15.33 |
| 500 | 10 | 5,000 | $6.38 | $76.50 |
| 1,000 | 10 | 10,000 | $12.75 | $153 |
| 5,000 | 10 | 50,000 | $63.75 | $765 |
| 10,000 | 10 | 100,000 | $127.50 | $1,530 |
| 50,000 | 20 | 1,000,000 | $2,550 | $30,600 |

*(Costs above are for API requests only, add base infrastructure ~$8-18/month)*

---

## 3. AdSense Revenue Estimation

### Key Metrics

- **RPM (Revenue Per Thousand Impressions)**: Varies by niche
  - Finance/Currency tools: $3-12 RPM
  - **Conservative estimate**: $5 RPM
  - **Optimistic estimate**: $10 RPM

- **Page views per session**:
  - User lands on converter page: 1 page view
  - User performs 10 conversions on same page: Still 1 page view (SPA)
  - **Estimated**: 2-3 page views per session (including navigation)

- **Ad placements per page**: 3-4 units
  - Header: 1 horizontal banner
  - Sidebar: 1-2 display ads
  - In-content: 1 native ad

### Revenue Scenarios

| Daily Users | Page Views/User | Total Page Views/Day | Monthly Page Views | Est. Revenue (Conservative $5 RPM) | Est. Revenue (Optimistic $10 RPM) |
|-------------|-----------------|----------------------|--------------------|------------------------------------|-----------------------------------|
| 100 | 2.5 | 250 | 7,500 | $37.50 | $75 |
| 500 | 2.5 | 1,250 | 37,500 | $187.50 | $375 |
| 1,000 | 2.5 | 2,500 | 75,000 | $375 | $750 |
| 5,000 | 2.5 | 12,500 | 375,000 | $1,875 | $3,750 |
| 10,000 | 3 | 30,000 | 900,000 | $4,500 | $9,000 |
| 50,000 | 3 | 150,000 | 4,500,000 | $22,500 | $45,000 |

---

## 4. Profit Analysis

### Break-Even Analysis (Conservative $5 RPM)

| Daily Users | Monthly AWS Cost | Monthly Ad Revenue | Monthly Profit | Profit Margin |
|-------------|------------------|-------------------|----------------|---------------|
| 100 | $20 | $37.50 | **+$17.50** | 47% |
| 500 | $24 | $187.50 | **+$163.50** | 87% |
| 1,000 | $31 | $375 | **+$344** | 92% |
| 5,000 | $82 | $1,875 | **+$1,793** | 96% |
| 10,000 | $146 | $4,500 | **+$4,354** | 97% |
| 50,000 | $2,568 | $22,500 | **+$19,932** | 88% |

### Break-Even Analysis (Optimistic $10 RPM)

| Daily Users | Monthly AWS Cost | Monthly Ad Revenue | Monthly Profit | Profit Margin |
|-------------|------------------|-------------------|----------------|---------------|
| 100 | $20 | $75 | **+$55** | 73% |
| 500 | $24 | $375 | **+$351** | 94% |
| 1,000 | $31 | $750 | **+$719** | 96% |
| 5,000 | $82 | $3,750 | **+$3,668** | 98% |
| 10,000 | $146 | $9,000 | **+$8,854** | 98% |
| 50,000 | $2,568 | $45,000 | **+$42,432** | 94% |

### **Key Insight**:
Even at conservative RPM estimates, the business is **profitable from 100+ daily users**. The cost per request is very low (~$0.000004), making rate limiting more about abuse prevention than cost control.

---

## 5. Abuse & Cost Overrun Scenarios

### Attack Scenario: Malicious Bot

**Scenario**: A bot makes 1,000 requests/second for 1 hour

- **Total requests**: 3,600,000
- **AWS Cost**: 3.6M × $0.00000425 = **$15.30**
- **Impact**: Minimal direct cost, but could:
  - Hit API rate limits on ExchangeRate/CoinGecko
  - Inflate CloudWatch logs costs
  - Impact legitimate user experience (slower responses)

### Heavy User Scenario

**Scenario**: 100 users making 100 requests/hour each

- **Hourly requests**: 10,000
- **Daily requests**: 240,000
- **Monthly requests**: 7,200,000
- **Monthly AWS Cost**: $30.60
- **Likely Ad Revenue**: These users probably aren't genuine → $0
- **Net Loss**: -$30.60/month

**Conclusion**: Cost overruns from abuse are relatively minor, but can degrade service quality and waste budget.

---

## 6. Rate Limiting Recommendations

### Recommended Rate Limits

#### **Tier 1: Anonymous Users (No IP tracking complexity)**
- **15 requests per hour** per IP address
- **Burst allowance**: 5 requests per minute
- **Daily cap**: 100 requests per IP

**Rationale**:
- Legitimate user typically makes 5-20 conversions per session
- Allows multiple sessions per day
- Prevents bot abuse
- Very low impact on genuine users

#### **Tier 2: Registered Users** (Future consideration)
- **50 requests per hour**
- **500 requests per day**
- **Benefits**: Higher limits, no captcha, API access

#### **Tier 3: Premium Users** (Future monetization)
- **Unlimited** or 10,000+ requests/day
- **API key** access
- **Monthly fee**: $5-10/month

### Implementation Strategy

```typescript
// Pseudocode for rate limiter
interface RateLimitConfig {
  windowMs: number;        // Time window in ms
  max: number;             // Max requests per window
  skipFailedRequests: true; // Don't count failed requests
  standardHeaders: true;    // Return rate limit info in headers
  legacyHeaders: false;
}

const currencyRateLimiter = {
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15,                   // 15 requests per hour
  message: "Too many requests. Please try again later."
}
```

### Cost Impact of Rate Limiting

| Scenario | Without Rate Limit | With 15/hour Limit | Savings |
|----------|-------------------|-------------------|---------|
| 100 bots × 1000 req/hour | $4.25 | $0.06 | **98.6% reduction** |
| 1 heavy user (500 req/hour) | $0.02 | $0.0006 | **97% reduction** |

---

## 7. Monitoring & Alerts

### Key Metrics to Track

1. **Requests per hour/day**
   - Alert threshold: >100,000 requests/hour

2. **DynamoDB read/write units consumed**
   - Alert threshold: >50% of provisioned capacity (if switching to provisioned)

3. **Lambda execution costs**
   - Alert threshold: >$50/day

4. **Unique IPs hitting rate limits**
   - Alert threshold: >10% of total IPs
   - Action: Review if limits are too restrictive

5. **AdSense RPM and CTR**
   - Track monthly to adjust rate limits based on revenue

### AWS Budget Alerts

```yaml
Budget Name: "ToolsWorx Monthly Budget"
Amount: $500
Alerts:
  - Threshold: 50% ($250) - Email notification
  - Threshold: 80% ($400) - Email + SMS notification
  - Threshold: 100% ($500) - Emergency alert + auto-shutdown option
```

---

## 8. Optimization Opportunities

### Cost Reduction Strategies

1. **DynamoDB Provisioned Capacity** (if usage is predictable)
   - 10 RCU (Read Capacity Units): $0.47/month
   - 5 WCU (Write Capacity Units): $2.35/month
   - **Savings**: 60-80% vs on-demand at high volume

2. **CloudFront CDN Caching**
   - Cache currency/crypto data for 5-10 minutes client-side
   - Reduce API calls by 70-90%
   - **Cost**: $0.085/GB + $0.01/10,000 requests
   - **Savings**: Huge reduction in DynamoDB reads

3. **API Response Caching**
   - Cache currency rates in user's browser (localStorage)
   - TTL: 5-10 minutes
   - **Savings**: ~90% reduction in API calls per user

### Revenue Optimization Strategies

1. **Ad Placement Optimization**
   - A/B test ad positions
   - Target: $8-12 RPM for financial tools

2. **Premium Tier Upsells**
   - Offer unlimited API access for $10/month
   - Target: Convert 1-2% of power users

3. **Affiliate Partnerships**
   - Partner with currency exchange services (Wise, XE)
   - Revenue: $5-20 per conversion

---

## 9. Final Recommendations

### **Immediate Actions**

1. **Implement Rate Limiting**:
   - 15 requests/hour per IP for currency/crypto converters
   - 5 requests/minute burst allowance
   - 100 requests/day hard cap per IP

2. **Set Up AWS Budgets**:
   - Monthly budget: $500
   - Alert at 50%, 80%, 100%

3. **Enable CloudWatch Alarms**:
   - DynamoDB throttling
   - Lambda errors >5%
   - API Gateway 4xx/5xx errors >10%

### **Short-Term (1-3 months)**

1. **Implement Client-Side Caching**:
   - Cache rates for 10 minutes in localStorage
   - Reduce backend calls by 80-90%

2. **Monitor Metrics**:
   - Track actual RPM (currently assumed $5-10)
   - Adjust rate limits based on real revenue data

3. **Add Analytics**:
   - Track conversion patterns
   - Identify heavy users vs legitimate users

### **Long-Term (3-12 months)**

1. **Premium Tier**:
   - $10/month for unlimited access + API key
   - Target: 50-100 premium users = $500-1,000/month

2. **API Marketplace**:
   - Sell API access to developers
   - Pricing: $50/month for 100,000 requests

3. **Switch to Provisioned DynamoDB**:
   - If traffic becomes predictable
   - Savings: 60-80% on database costs

---

## Summary Table: Rate Limit vs Revenue Impact

| Rate Limit | Legitimate Users Affected | Cost Savings (Abuse) | Revenue Impact |
|------------|---------------------------|----------------------|----------------|
| 5/hour | 30-40% | High | **-25% revenue** ❌ |
| 10/hour | 10-15% | High | **-10% revenue** ⚠️ |
| **15/hour** | **<5%** | **Very High** | **-2% revenue** ✅ **RECOMMENDED** |
| 20/hour | <2% | High | -1% revenue | ✅ Good |
| 30/hour | <1% | Medium | No impact | ⚠️ Allows some abuse |
| Unlimited | 0% | None | No impact | ❌ Allows abuse |

---

## Conclusion

**Recommended Rate Limit: 15-20 requests per IP per hour**

This balances:
- ✅ Prevents abuse (saves 95%+ on abuse costs)
- ✅ Minimal impact on legitimate users (<5% affected)
- ✅ Maintains revenue (only 2% revenue impact)
- ✅ Protects infrastructure
- ✅ Allows for genuine use cases (multiple conversions per session)

**Expected Monthly Costs** (at 1,000 daily users):
- AWS: $31/month
- Revenue (conservative): $375/month
- **Profit: $344/month (92% margin)**

The business model is highly profitable even at low scale. Rate limiting is primarily about **abuse prevention**, not cost control.
