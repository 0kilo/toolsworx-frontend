# Fix for Client Component Error

## The Problem

You're getting this error:
```
Error: Event handlers cannot be passed to Client Component props.
onConvert={function convertDistance}
```

This happens because Next.js 14 doesn't allow passing functions from Server Components to Client Components.

## The Solution

I've already updated `components/converters/formula-converter.tsx` to fix this.

Now you need to update your converter pages to use `conversionType` instead of `onConvert`.

---

## Files to Update

### 1. app/convert/celsius-fahrenheit/page.tsx

**Remove this line:**
```typescript
import { convertTemperature } from "@/lib/converters/formula-converters"
```

**Change this:**
```typescript
onConvert={convertTemperature}
```

**To this:**
```typescript
conversionType="temperature"
```

---

### 2. app/convert/fahrenheit-celsius/page.tsx

**Remove:**
```typescript
import { convertTemperature } from "@/lib/converters/formula-converters"
```

**Change:**
```typescript
onConvert={convertTemperature}
```

**To:**
```typescript
conversionType="temperature"
```

---

### 3. app/convert/km-miles/page.tsx

**Remove:**
```typescript
import { convertDistance } from "@/lib/converters/formula-converters"
```

**Change:**
```typescript
onConvert={convertDistance}
```

**To:**
```typescript
conversionType="distance"
```

---

### 4. app/convert/miles-km/page.tsx

**Remove:**
```typescript
import { convertDistance } from "@/lib/converters/formula-converters"
```

**Change:**
```typescript
onConvert={convertDistance}
```

**To:**
```typescript
conversionType="distance"
```

---

### 5. app/convert/feet-meters/page.tsx

**Remove:**
```typescript
import { convertDistance } from "@/lib/converters/formula-converters"
```

**Change:**
```typescript
onConvert={convertDistance}
```

**To:**
```typescript
conversionType="distance"
```

---

### 6. app/convert/kg-lbs/page.tsx

**Remove:**
```typescript
import { convertWeight } from "@/lib/converters/formula-converters"
```

**Change:**
```typescript
onConvert={convertWeight}
```

**To:**
```typescript
conversionType="weight"
```

---

### 7. app/convert/lbs-kg/page.tsx

**Remove:**
```typescript
import { convertWeight } from "@/lib/converters/formula-converters"
```

**Change:**
```typescript
onConvert={convertWeight}
```

**To:**
```typescript
conversionType="weight"
```

---

### 8. app/convert/liters-gallons/page.tsx

**Remove:**
```typescript
import { convertVolume } from "@/lib/converters/formula-converters"
```

**Change:**
```typescript
onConvert={convertVolume}
```

**To:**
```typescript
conversionType="volume"
```

---

### 9. app/convert/hours-minutes/page.tsx

**Remove:**
```typescript
import { convertTime } from "@/lib/converters/formula-converters"
```

**Change:**
```typescript
onConvert={convertTime}
```

**To:**
```typescript
conversionType="time"
```

---

## Quick Find & Replace

Use your code editor's find and replace (across all files in `app/convert/`):

1. **Find:** `import { convertTemperature } from "@/lib/converters/formula-converters"`
   **Replace:** *(delete the line)*

2. **Find:** `import { convertDistance } from "@/lib/converters/formula-converters"`
   **Replace:** *(delete the line)*

3. **Find:** `import { convertWeight } from "@/lib/converters/formula-converters"`
   **Replace:** *(delete the line)*

4. **Find:** `import { convertVolume } from "@/lib/converters/formula-converters"`
   **Replace:** *(delete the line)*

5. **Find:** `import { convertTime } from "@/lib/converters/formula-converters"`
   **Replace:** *(delete the line)*

6. **Find:** `onConvert={convertTemperature}`
   **Replace:** `conversionType="temperature"`

7. **Find:** `onConvert={convertDistance}`
   **Replace:** `conversionType="distance"`

8. **Find:** `onConvert={convertWeight}`
   **Replace:** `conversionType="weight"`

9. **Find:** `onConvert={convertVolume}`
   **Replace:** `conversionType="volume"`

10. **Find:** `onConvert={convertTime}`
    **Replace:** `conversionType="time"`

---

## Example: Before and After

### Before (Broken):
```typescript
import { Metadata } from "next"
import { FormulaConverter } from "@/components/converters/formula-converter"
import { convertDistance } from "@/lib/converters/formula-converters"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"

export default function KmMilesPage() {
  return (
    <FormulaConverter
      title="Distance Converter"
      units={distanceUnits}
      defaultFromUnit="km"
      defaultToUnit="mile"
      onConvert={convertDistance}  // ❌ ERROR: Can't pass functions
      placeholder="Enter distance"
    />
  )
}
```

### After (Fixed):
```typescript
import { Metadata } from "next"
import { FormulaConverter } from "@/components/converters/formula-converter"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
// ✅ No more import of convertDistance

export default function KmMilesPage() {
  return (
    <FormulaConverter
      title="Distance Converter"
      units={distanceUnits}
      defaultFromUnit="km"
      defaultToUnit="mile"
      conversionType="distance"  // ✅ Pass string instead
      placeholder="Enter distance"
    />
  )
}
```

---

## Why This Works

- **Before**: Trying to pass JavaScript functions from server → client (not allowed)
- **After**: Passing a string identifier, and the client component imports the functions itself

The `FormulaConverter` component now imports all conversion functions and selects the right one based on the `conversionType` string.

---

## Test After Fixing

```bash
npm run dev
```

All errors should be gone! ✅
