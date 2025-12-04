# Google Analytics 4 (GA4) Implementation Plan

## Overview
Implement Google Analytics 4 to track user sessions, page views, and custom events for Tools Worx. GA4 is **100% FREE** with unlimited events and users.

---

## Why GA4 Over Amazon Pinpoint

| Feature | GA4 | Amazon Pinpoint |
|---------|-----|-----------------|
| **Cost** | **FREE** | $1 per 100K events (~$10-50/mo) |
| **Event Limit** | Unlimited | 5K free, then paid |
| **Deprecation** | Active, growing | **Ending Oct 2026** |
| **Setup** | 5 minutes | 1-2 hours |
| **Dashboard** | Excellent | Basic |
| **SEO Integration** | Google Search Console | None |
| **Ads Integration** | Google Ads | None |

---

## Implementation Steps

### **Step 1: Get GA4 Measurement ID** (2 minutes)

1. Go to [analytics.google.com](https://analytics.google.com)
2. Click **Admin** → **Create Property**
3. Enter property name: `Tools Worx`
4. Select timezone and currency
5. Click **Next** → **Create**
6. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

---

### **Step 2: Add Environment Variable** (1 minute)

**File:** `.env.local`

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**File:** `.env.local.example` (update for team)

```bash
# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

### **Step 3: Create Analytics Service** (1 file)

**File:** `lib/services/analytics-service.ts` (new)

```typescript
// Google Analytics 4 tracking service
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

export const analytics = {
  // Track page views (automatic via gtag config)
  pageView: (url: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: url,
      })
    }
  },

  // Track custom events
  event: (eventName: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, params)
    }
  },

  // Track tool usage
  trackToolUsage: (toolId: string, toolName: string, category: string) => {
    analytics.event('tool_usage', {
      tool_id: toolId,
      tool_name: toolName,
      category: category,
    })
  },

  // Track conversions
  trackConversion: (toolId: string, fromFormat: string, toFormat: string, success: boolean) => {
    analytics.event('conversion', {
      tool_id: toolId,
      from_format: fromFormat,
      to_format: toFormat,
      success: success,
    })
  },

  // Track errors
  trackError: (errorType: string, errorMessage: string, context?: string) => {
    analytics.event('error', {
      error_type: errorType,
      error_message: errorMessage,
      context: context || 'unknown',
    })
  },

  // Track search
  trackSearch: (searchTerm: string, resultsCount: number) => {
    analytics.event('search', {
      search_term: searchTerm,
      results_count: resultsCount,
    })
  },
}
```

---

### **Step 4: Add GA4 Script to Layout** (1 file update)

**File:** `app/layout.tsx`

```typescript
import Script from 'next/script'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        
        {/* Existing AdSense script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8286321884742507"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <AmplifyProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AmplifyProvider>
      </body>
    </html>
  )
}
```

---

### **Step 5: Track Page Views** (1 file update)

**File:** `app/page.tsx` (add search tracking)

```typescript
import { analytics } from '@/lib/services/analytics-service'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Track search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query) {
      const results = converters.filter(/* filter logic */)
      analytics.trackSearch(query, results.length)
    }
  }

  return (
    // ... existing code
    <Input
      value={searchQuery}
      onChange={(e) => handleSearch(e.target.value)}
    />
  )
}
```

---

### **Step 6: Track Tool Usage** (example)

**File:** `app/calculators/bmi/page.tsx`

```typescript
import { analytics } from '@/lib/services/analytics-service'
import { useEffect } from 'react'

export default function BMICalculatorPage() {
  // Track page view
  useEffect(() => {
    analytics.trackToolUsage('bmi', 'BMI Calculator', 'calculators')
  }, [])

  const handleCalculate = (values: Record<string, string>) => {
    // Track calculation
    analytics.trackConversion('bmi', 'input', 'result', true)
    
    // ... existing calculation logic
  }

  return (/* ... */)
}
```

---

### **Step 7: Track Conversions** (example)

**File:** `components/shared/file-converter.tsx`

```typescript
import { analytics } from '@/lib/services/analytics-service'

const handleConvert = async () => {
  try {
    // ... conversion logic
    analytics.trackConversion(toolId, fromFormat, toFormat, true)
  } catch (error) {
    analytics.trackError('conversion_failed', error.message, toolId)
    analytics.trackConversion(toolId, fromFormat, toFormat, false)
  }
}
```

---

## What You Get (FREE)

### **Automatic Tracking**
- ✅ Page views
- ✅ Session duration
- ✅ Bounce rate
- ✅ User demographics (age, gender, location)
- ✅ Device breakdown (mobile, desktop, tablet)
- ✅ Traffic sources (organic, direct, referral, social)
- ✅ Real-time users

### **Custom Events**
- ✅ Tool usage by category
- ✅ Conversion success/failure rates
- ✅ Search queries and results
- ✅ Error tracking
- ✅ User engagement metrics

### **Integrations**
- ✅ Google Search Console (SEO data)
- ✅ Google Ads (monetization)
- ✅ BigQuery export (advanced analysis)

---

## GA4 Dashboard Views

### **1. Realtime Report**
- Active users right now
- Pages being viewed
- Traffic sources
- User locations

### **2. Acquisition Report**
- How users find your site
- Organic search performance
- Social media traffic
- Referral sources

### **3. Engagement Report**
- Most popular tools
- Average session duration
- Pages per session
- Bounce rate by page

### **4. Custom Events Report**
- Tool usage frequency
- Conversion rates
- Search behavior
- Error rates

---

## Cost Comparison

### **At 100K Monthly Visitors**

| Service | Monthly Cost | Annual Cost |
|---------|--------------|-------------|
| **GA4** | **$0** | **$0** |
| Amazon Pinpoint | $10-20 | $120-240 |
| Mixpanel | $89+ | $1,068+ |
| Amplitude | $49+ | $588+ |

### **At 1M Monthly Visitors**

| Service | Monthly Cost | Annual Cost |
|---------|--------------|-------------|
| **GA4** | **$0** | **$0** |
| Amazon Pinpoint | $50-100 | $600-1,200 |
| Mixpanel | $999+ | $11,988+ |
| Amplitude | $995+ | $11,940+ |

---

## Implementation Checklist

- [ ] Create GA4 property and get Measurement ID
- [ ] Add `NEXT_PUBLIC_GA_ID` to `.env.local`
- [ ] Create `lib/services/analytics-service.ts`
- [ ] Update `app/layout.tsx` with GA4 scripts
- [ ] Add search tracking to `app/page.tsx`
- [ ] Add tool usage tracking to popular tools
- [ ] Add conversion tracking to file/media converters
- [ ] Test in development (check browser console for gtag calls)
- [ ] Deploy to production
- [ ] Verify data in GA4 dashboard (24-48 hours for full data)

---

## Testing

### **Development Testing**
```bash
# Start dev server
npm run dev

# Open browser console
# Navigate to any page
# Check for gtag calls:
# gtag('config', 'G-XXXXXXXXXX', {...})
# gtag('event', 'tool_usage', {...})
```

### **Production Verification**
1. Deploy to production
2. Wait 24-48 hours for data
3. Check GA4 dashboard → Realtime report
4. Verify events in Events report

---

## Advanced Features (Optional)

### **Enhanced Measurement** (Auto-enabled)
- Scroll tracking
- Outbound link clicks
- Site search
- Video engagement
- File downloads

### **Custom Dimensions** (Future)
```typescript
gtag('config', 'G-XXXXXXXXXX', {
  custom_map: {
    dimension1: 'tool_category',
    dimension2: 'conversion_type',
  }
})
```

### **User Properties** (Future)
```typescript
gtag('set', 'user_properties', {
  favorite_category: 'calculators',
  tools_used_count: 5,
})
```

---

## Privacy & GDPR Compliance

### **Cookie Consent** (Future Enhancement)
```typescript
// Disable GA4 until consent
window['ga-disable-G-XXXXXXXXXX'] = true

// Enable after consent
window['ga-disable-G-XXXXXXXXXX'] = false
gtag('consent', 'update', {
  analytics_storage: 'granted'
})
```

### **IP Anonymization** (Auto-enabled in GA4)
GA4 automatically anonymizes IP addresses.

---

## Migration from Pinpoint (If Needed)

If you already have Pinpoint:
1. Implement GA4 alongside Pinpoint
2. Run both for 1-2 months
3. Compare data accuracy
4. Remove Pinpoint before Oct 2026 deprecation

---

## Support & Resources

- **GA4 Documentation:** https://support.google.com/analytics/answer/9304153
- **Event Reference:** https://support.google.com/analytics/answer/9267735
- **Measurement Protocol:** https://developers.google.com/analytics/devguides/collection/protocol/ga4
- **BigQuery Export:** https://support.google.com/analytics/answer/9358801

---

## Summary

✅ **Total Implementation Time:** 30 minutes  
✅ **Files to Create:** 1 (`analytics-service.ts`)  
✅ **Files to Update:** 2 (`layout.tsx`, `page.tsx`)  
✅ **Cost:** $0 forever  
✅ **Event Limit:** Unlimited  
✅ **Data Retention:** 14 months (free)  
✅ **Future-proof:** Active product, not deprecated  

**Recommendation:** Implement GA4 immediately. It's free, powerful, and the industry standard.
