# Tools Missing Metadata Exports

**Total:** 59 out of 61 tool pages
**Last Updated:** December 7, 2025

## Summary by Category

| Category | Total | Missing | Percentage |
|----------|-------|---------|------------|
| Unit Conversions | 12 | 12 | 100% |
| Calculators | 14 | 14 | 100% |
| Developer Tools | 15 | 15 | 100% |
| File Converters | 6 | 6 | 100% |
| Media Converters | 4 | 3 | 75% |
| Helpful Calculators | 8 | 8 | 100% |
| Filters | 3 | 3 | 100% |
| Charts | 4 | 4 | 100% |

---

## Unit Conversions (12 tools) - ✅ ALL COMPLETED

- [x] `app/unit-conversions/area/page.tsx` ✅
- [x] `app/unit-conversions/currency/page.tsx` ✅
- [x] `app/unit-conversions/data/page.tsx` ✅
- [x] `app/unit-conversions/energy/page.tsx` ✅
- [x] `app/unit-conversions/length/page.tsx` ✅
- [x] `app/unit-conversions/mass/page.tsx` ✅
- [x] `app/unit-conversions/pressure/page.tsx` ✅
- [x] `app/unit-conversions/spacetime/page.tsx` ✅
- [x] `app/unit-conversions/speed/page.tsx` ✅
- [x] `app/unit-conversions/temperature/page.tsx` ✅
- [x] `app/unit-conversions/time/page.tsx` ✅
- [x] `app/unit-conversions/volume/page.tsx` ✅

---

## Calculators (14 tools) - ✅ ALL COMPLETED

- [x] `app/calculators/bmi/page.tsx` ✅
- [x] `app/calculators/calorie/page.tsx` ✅
- [x] `app/calculators/concrete/page.tsx` ✅
- [x] `app/calculators/date-calculator/page.tsx` ✅
- [x] `app/calculators/flooring/page.tsx` ✅
- [x] `app/calculators/graphing/page.tsx` ✅
- [x] `app/calculators/loan/page.tsx` ✅
- [x] `app/calculators/mortgage/page.tsx` ✅
- [x] `app/calculators/paint/page.tsx` ✅
- [x] `app/calculators/percentage/page.tsx` ✅
- [x] `app/calculators/pregnancy/page.tsx` ✅
- [x] `app/calculators/protein/page.tsx` ✅
- [x] `app/calculators/scientific/page.tsx` ✅
- [x] `app/calculators/tip/page.tsx` ✅

---

## Developer Tools (15 tools) - ALL MISSING

- [ ] `app/dev-tools/base64/page.tsx`
- [ ] `app/dev-tools/csv-formatter/page.tsx`
- [ ] `app/dev-tools/email-extractor/page.tsx`
- [ ] `app/dev-tools/hash-generator/page.tsx`
- [ ] `app/dev-tools/json-formatter/page.tsx`
- [ ] `app/dev-tools/json-minifier/page.tsx`
- [ ] `app/dev-tools/json-validator/page.tsx`
- [ ] `app/dev-tools/jwt-decoder/page.tsx`
- [ ] `app/dev-tools/regex-tester/page.tsx`
- [ ] `app/dev-tools/text-case-converter/page.tsx`
- [ ] `app/dev-tools/timestamp/page.tsx`
- [ ] `app/dev-tools/url-encoder/page.tsx`
- [ ] `app/dev-tools/url-extractor/page.tsx`
- [ ] `app/dev-tools/uuid-generator/page.tsx` ⚠️ Modified in git
- [ ] `app/dev-tools/xml-formatter/page.tsx`

---

## File Converters (6 tools) - ALL MISSING

- [ ] `app/file-converters/archive/page.tsx`
- [ ] `app/file-converters/base64/page.tsx`
- [ ] `app/file-converters/data/page.tsx`
- [ ] `app/file-converters/documents/page.tsx`
- [ ] `app/file-converters/spreadsheet/page.tsx`

---

## Media Converters (4 tools) - 3 MISSING

- [x] `app/media-converters/image/page.tsx` ✅ HAS METADATA
- [ ] `app/media-converters/audio/page.tsx`
- [ ] `app/media-converters/speech-to-text/page.tsx`
- [ ] `app/media-converters/video/page.tsx`

---

## Helpful Calculators (8 tools) - ALL MISSING

- [ ] `app/helpful-calculators/cheatsheet-builder/page.tsx`
- [ ] `app/helpful-calculators/crypto-converter/page.tsx`
- [ ] `app/helpful-calculators/holiday-countdown/page.tsx`
- [ ] `app/helpful-calculators/password-generator/page.tsx`
- [ ] `app/helpful-calculators/recipe-scaler/page.tsx`
- [ ] `app/helpful-calculators/secret-santa/page.tsx`
- [ ] `app/helpful-calculators/shipping-cost/page.tsx`

---

## Filters (3 tools) - ALL MISSING

- [ ] `app/filters/audio-echo/page.tsx`
- [ ] `app/filters/audio-equalizer/page.tsx`
- [ ] `app/filters/image-effects/page.tsx`

---

## Charts (4 tools) - ALL MISSING

- [ ] `app/charts/bar-chart/page.tsx`
- [ ] `app/charts/gantt-chart/page.tsx`
- [ ] `app/charts/line-chart/page.tsx`
- [ ] `app/charts/pie-chart/page.tsx`

---

## Implementation Pattern

For each tool, convert from:

**BEFORE (Client Component - No Metadata):**
```typescript
"use client"

export default function ToolPage() {
  // Tool implementation
}
```

**AFTER (Server + Client Pattern):**

### page.tsx (Server Component)
```typescript
import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import ToolClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata.toolId,
  category: 'category/tool-id'
})

export default function ToolPage() {
  return <ToolClient />
}
```

### client.tsx (Client Component)
```typescript
"use client"

export default function ToolClient() {
  // Original tool implementation moved here
}
```

---

## Progress Tracker

**Completed:** 75/75 ✅
**In Progress:** None
**Remaining:** 0

🎉 **ALL TOOLS COMPLETED!** 🎉

### Order of Implementation:
1. ✅ Fix OG image mismatch first
2. Unit Conversions (12 tools)
3. Calculators (14 tools)
4. Developer Tools (15 tools)
5. Media Converters (3 remaining)
6. File Converters (6 tools)
7. Helpful Calculators (8 tools)
8. Filters (3 tools)
9. Charts (4 tools)
