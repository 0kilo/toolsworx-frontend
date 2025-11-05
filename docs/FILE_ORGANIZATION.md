# File Organization Guide

This document explains the logical organization of files by category in the project.

## Table of Contents

1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
3. [Category System](#category-system)
4. [Adding New Converters](#adding-new-converters)
5. [Templates](#templates)

---

## Overview

The project is organized by **5 main categories**, with all related files grouped together:

1. **Unit Conversions** - Temperature, distance, weight, volume, time
2. **Calculators** - BMI, mortgage, tip calculators, etc.
3. **File Converters** - PDF, Word, Excel conversions
4. **Media Converters** - Image, video, audio conversions
5. **Developer Tools** - JSON formatter, validators, utilities

**Key Principle:** Everything related to a category is in ONE place.

---

## Directory Structure

```
convert-all/
├── app/
│   ├── unit-conversions/          # Unit conversion pages
│   │   ├── celsius-fahrenheit/
│   │   ├── km-miles/
│   │   └── ...
│   ├── calculators/                # Calculator pages
│   │   └── (future calculator pages)
│   ├── file-converters/            # File converter pages
│   │   └── pdf-word/
│   ├── media-converters/           # Media converter pages
│   │   └── image-converter/
│   ├── developer-tools/            # Developer tool pages
│   │   └── (future dev tool pages)
│   ├── category/[id]/             # Category landing pages
│   ├── layout.tsx
│   └── page.tsx                   # Homepage
│
├── lib/
│   ├── categories/                # Category logic organized by category
│   │   ├── unit-conversions/
│   │   │   ├── template.tsx       # Unit conversion template component
│   │   │   ├── logic.ts           # Conversion functions
│   │   │   ├── registry.ts        # All unit conversions registered
│   │   │   └── index.ts           # Exports everything
│   │   ├── calculators/
│   │   │   ├── template.tsx       # Calculator template component
│   │   │   ├── registry.ts        # All calculators registered
│   │   │   └── index.ts
│   │   ├── file-converters/
│   │   │   ├── template.tsx       # File converter template
│   │   │   ├── registry.ts        # All file converters registered
│   │   │   └── index.ts
│   │   ├── media-converters/
│   │   │   ├── template.tsx       # Media converter template
│   │   │   ├── registry.ts        # All media converters registered
│   │   │   └── index.ts
│   │   └── developer-tools/
│   │       ├── template.tsx       # Developer tool template
│   │       ├── registry.ts        # All developer tools registered
│   │       └── index.ts
│   ├── categories.ts              # Category metadata (colors, descriptions)
│   ├── registry.ts                # Master registry combining all categories
│   ├── rate-limit.ts              # Rate limiting for resource-intensive operations
│   └── utils.ts
│
├── components/
│   ├── shared/                    # Shared UI components
│   │   ├── converter-card.tsx    # Card for displaying converters
│   │   └── file-dropzone.tsx     # File upload component
│   ├── ui/                        # Base UI components (shadcn)
│   ├── layout/                    # Header, footer
│   └── ads/                       # Ad components
│
├── types/
│   └── converter.ts               # TypeScript types
│
└── docs/                          # All documentation
    ├── FILE_ORGANIZATION.md       # This file
    ├── TEMPLATES_GUIDE.md         # Template usage guide
    ├── LIBRARIES_FOR_CONVERSION.md
    └── ...
```

---

## Category System

### How It Works

Each category has THREE key files in its own folder:

1. **`template.tsx`** - The reusable UI component template
2. **`registry.ts`** - List of all tools in this category
3. **`logic.ts`** (optional) - Shared logic/functions
4. **`index.ts`** - Exports everything for easy imports

### Example: Unit Conversions Category

```
lib/categories/unit-conversions/
├── template.tsx     # UnitConversionTemplate component
├── logic.ts         # convertTemperature, convertDistance, etc.
├── registry.ts      # unitConversionTools array
└── index.ts         # exports { UnitConversionTemplate, convertTemperature, unitConversionTools }
```

**Usage:**

```typescript
// Import everything from one place
import { UnitConversionTemplate, unitConversionTools } from "@/lib/categories/unit-conversions"

// Or import specific items
import { UnitConversionTemplate } from "@/lib/categories/unit-conversions/template"
import { unitConversionTools } from "@/lib/categories/unit-conversions/registry"
```

### Master Registry

The master registry (`lib/registry.ts`) combines all category registries:

```typescript
import { unitConversionTools } from "./categories/unit-conversions/registry"
import { calculatorTools } from "./categories/calculators/registry"
// ... etc

export const converters = [
  ...unitConversionTools,
  ...calculatorTools,
  ...fileConverterTools,
  ...mediaConverterTools,
  ...developerTools,
]
```

**Usage:**

```typescript
import { converters, getPopularConverters } from "@/lib/registry"
```

---

## Adding New Converters

### Step 1: Choose the Right Category

Determine which category your converter belongs to:
- **Unit Conversions:** Converting between measurement units
- **Calculators:** Computing values (BMI, mortgage, etc.)
- **File Converters:** Document format conversions
- **Media Converters:** Image, video, audio conversions
- **Developer Tools:** JSON, Base64, regex, etc.

### Step 2: Add to Registry

Edit the `registry.ts` file in the appropriate category:

```typescript
// lib/categories/calculators/registry.ts
export const calculatorTools: ConverterMetadata[] = [
  {
    id: "bmi-calculator",
    title: "BMI Calculator",
    description: "Calculate your Body Mass Index",
    category: "calculator",
    icon: Scale,
    href: "/calculators/bmi",  // Note: uses /calculators/ path
    keywords: ["bmi", "body mass index", "health"],
    popular: true,
  },
  // ... other calculators
]
```

### Step 3: Create the Page

Create the page file in the appropriate app folder:

```typescript
// app/calculators/bmi/page.tsx
import { Metadata } from "next"
import { CalculatorTemplate } from "@/lib/categories/calculators"

export const metadata: Metadata = {
  title: "BMI Calculator - Free Online Tool",
  description: "Calculate your Body Mass Index instantly",
}

export default function BMICalculatorPage() {
  return (
    <CalculatorTemplate
      title="BMI Calculator"
      description="Calculate your Body Mass Index"
      fields={[/* ... */]}
      onCalculate={calculateBMI}
    />
  )
}
```

### Step 4: Test

- Visit homepage - your converter should appear automatically
- Visit category page `/category/calculators` - it should appear there
- Visit your converter page `/calculators/bmi` - it should work

---

## Templates

Each category has a template component:

| Category | Template Component | Location |
|----------|-------------------|----------|
| Unit Conversions | `UnitConversionTemplate` | `lib/categories/unit-conversions/template.tsx` |
| Calculators | `CalculatorTemplate` | `lib/categories/calculators/template.tsx` |
| File Converters | `FileConverterTemplate` | `lib/categories/file-converters/template.tsx` |
| Media Converters | `MediaConverterTemplate` | `lib/categories/media-converters/template.tsx` |
| Developer Tools | `DeveloperToolTemplate` | `lib/categories/developer-tools/template.tsx` |

### Template Features

All templates include:
- ✅ Consistent UI design
- ✅ Copy/clear functionality
- ✅ Error handling
- ✅ Mobile responsive
- ✅ Rate limiting support (where applicable)
- ✅ SEO-friendly structure

### Detailed Template Guide

See [`docs/TEMPLATES_GUIDE.md`](./TEMPLATES_GUIDE.md) for:
- Complete usage examples for each template
- Props documentation
- Implementation patterns
- Best practices

---

## Benefits of This Organization

### ✅ Logical Grouping
- All unit conversion files are together
- All calculator files are together
- Easy to find related code

### ✅ Scalability
- Add 100 calculators without cluttering other categories
- Each category can grow independently

### ✅ Easy Imports
- `import { UnitConversionTemplate } from "@/lib/categories/unit-conversions"`
- Everything for a category in one import path

### ✅ Clear Separation
- No confusion about where to put files
- No scattered files across multiple locations

### ✅ Maintainability
- Update a template → affects all converters in that category
- Clear ownership: calculator team owns `lib/categories/calculators/`

---

## Migration Notes

### Old Structure (DEPRECATED)
```
app/convert/              ❌ Scattered converter pages
components/converters/    ❌ Mixed templates and UI
components/templates/     ❌ Templates separated from logic
lib/converters/           ❌ Logic separated from templates
```

### New Structure (CURRENT)
```
app/unit-conversions/           ✅ Unit conversion pages together
app/calculators/                ✅ Calculator pages together
lib/categories/unit-conversions/ ✅ All unit conversion code together
lib/categories/calculators/      ✅ All calculator code together
```

### Backward Compatibility

The templates export backward-compatible names:

```typescript
// Old import (still works)
import { FormulaConverter } from "@/lib/categories/unit-conversions"

// New import (preferred)
import { UnitConversionTemplate } from "@/lib/categories/unit-conversions"
```

---

## Quick Reference

### Adding a Unit Conversion

1. Edit `lib/categories/unit-conversions/registry.ts`
2. Create `app/unit-conversions/your-converter/page.tsx`
3. Use `UnitConversionTemplate`

### Adding a Calculator

1. Edit `lib/categories/calculators/registry.ts`
2. Create `app/calculators/your-calculator/page.tsx`
3. Use `CalculatorTemplate`

### Adding a File Converter

1. Edit `lib/categories/file-converters/registry.ts`
2. Create `app/file-converters/your-converter/page.tsx`
3. Use `FileConverterTemplate`

### Adding a Media Converter

1. Edit `lib/categories/media-converters/registry.ts`
2. Create `app/media-converters/your-converter/page.tsx`
3. Use `MediaConverterTemplate`

### Adding a Developer Tool

1. Edit `lib/categories/developer-tools/registry.ts`
2. Create `app/developer-tools/your-tool/page.tsx`
3. Use `DeveloperToolTemplate`

---

## Questions?

- **Where do I put shared UI components?** → `components/shared/`
- **Where do I put category templates?** → `lib/categories/{category}/template.tsx`
- **Where do I register new tools?** → `lib/categories/{category}/registry.ts`
- **Where do I put category pages?** → `app/{category}/your-tool/page.tsx`
- **How do I import a template?** → `import { Template } from "@/lib/categories/{category}"`

---

## Summary

**One category = One folder = Everything together**

```
lib/categories/calculators/
  ├── template.tsx    ← UI template
  ├── logic.ts        ← Calculation functions
  ├── registry.ts     ← List of all calculators
  └── index.ts        ← Export everything

app/calculators/
  ├── bmi/           ← BMI calculator page
  ├── mortgage/      ← Mortgage calculator page
  └── tip/           ← Tip calculator page
```

Clean. Simple. Organized. 🎯
