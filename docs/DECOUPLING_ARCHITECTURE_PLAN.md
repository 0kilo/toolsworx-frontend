# Decoupling Architecture Plan

## Overview

Decouple tool content and logic from UI components:
1. **Content (JSON)** → Cheatsheet templates
2. **Logic (Functions)** → Reusable business logic

---

## Part 1: Content Decoupling (JSON Hierarchy)

### File Structure

```
public/
└── data/
    ├── tools.json                           # Master file (root)
    ├── categories/
    │   ├── unit-conversions.json            # Category index
    │   ├── calculators.json
    │   ├── helpful-calculators.json
    │   ├── file-converters.json
    │   └── media-converters.json
    └── tools/
        ├── unit-conversions/
        │   ├── temperature.json
        │   ├── distance.json
        │   ├── weight.json
        │   └── currency.json
        ├── calculators/
        │   ├── bmi.json
        │   ├── loan.json
        │   └── ...
        └── helpful-calculators/
            ├── recipe-scaler.json
            ├── crypto-converter.json
            └── ...
```

### Schema Definitions

```typescript
// types/tool-content.ts

export interface ToolSection {
  title: string;
  content: string[];
  type?: 'text' | 'list' | 'formula' | 'code';
}

export interface ToolContent {
  id: string;
  title: string;
  description: string;
  category: string;

  sections: ToolSection[];

  formulas?: {
    name: string;
    latex: string;
    description: string;
  }[];

  examples?: {
    title: string;
    input: string;
    output: string;
  }[];

  tips?: string[];
}

export interface CategoryIndex {
  id: string;
  name: string;
  description: string;
  tools: string[];  // Array of tool IDs
}

export interface MasterIndex {
  version: string;
  lastUpdated: string;
  categories: string[];  // Array of category IDs
}
```

### Example Files

**public/data/tools.json** (Master)
```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-12-02",
  "categories": [
    "unit-conversions",
    "calculators",
    "helpful-calculators",
    "file-converters",
    "media-converters"
  ]
}
```

**public/data/categories/unit-conversions.json** (Category)
```json
{
  "id": "unit-conversions",
  "name": "Unit Conversions",
  "description": "Convert between different units of measurement",
  "tools": [
    "temperature",
    "distance",
    "weight",
    "volume",
    "currency"
  ]
}
```

**public/data/tools/unit-conversions/temperature.json** (Tool)
```json
{
  "id": "temperature",
  "title": "Temperature Converter",
  "description": "Convert between Celsius, Fahrenheit, and Kelvin",
  "category": "unit-conversions",
  "sections": [
    {
      "title": "Conversion Formulas",
      "type": "formula",
      "content": [
        "Celsius to Fahrenheit: $F = C \\times \\frac{9}{5} + 32$",
        "Fahrenheit to Celsius: $C = (F - 32) \\times \\frac{5}{9}$",
        "Celsius to Kelvin: $K = C + 273.15$"
      ]
    },
    {
      "title": "Common Reference Points",
      "type": "list",
      "content": [
        "Water freezes: 0°C = 32°F = 273.15K",
        "Water boils: 100°C = 212°F = 373.15K",
        "Room temperature: ~20°C = ~68°F = ~293K"
      ]
    }
  ],
  "formulas": [
    {
      "name": "Celsius to Fahrenheit",
      "latex": "F = C \\times \\frac{9}{5} + 32",
      "description": "Multiply Celsius by 9/5 and add 32"
    }
  ],
  "examples": [
    {
      "title": "Freezing Point",
      "input": "0°C",
      "output": "32°F"
    }
  ],
  "tips": [
    "Water freezes at 0°C/32°F and boils at 100°C/212°F",
    "Kelvin is used in scientific calculations"
  ]
}
```

### Cheatsheet Builder Integration

```typescript
// app/helpful-calculators/cheatsheet-builder/page.tsx

import { useState, useEffect } from "react";

const [templates, setTemplates] = useState<ToolContent[]>([]);

useEffect(() => {
  async function loadTemplates() {
    // Load master index
    const master = await fetch('/data/tools.json').then(r => r.json());

    // Load all categories
    const categories = await Promise.all(
      master.categories.map(catId =>
        fetch(`/data/categories/${catId}.json`).then(r => r.json())
      )
    );

    // Load all tools
    const allTools = await Promise.all(
      categories.flatMap(cat =>
        cat.tools.map(toolId =>
          fetch(`/data/tools/${cat.id}/${toolId}.json`).then(r => r.json())
        )
      )
    );

    setTemplates(allTools);
  }

  loadTemplates();
}, []);

// Convert tool content to cheatsheet template
function toolToCheatsheet(tool: ToolContent): CheatsheetData {
  return {
    title: `${tool.title} Quick Reference`,
    date: new Date().toISOString().split('T')[0],
    subject: tool.category,
    layout: "double",
    fontSize: "medium",
    colorScheme: "default",
    items: tool.sections.flatMap(section =>
      section.content.map(content => ({
        id: crypto.randomUUID(),
        subtitle: section.title,
        description: content,
        type: section.type || 'text',
        importance: 'normal'
      }))
    )
  };
}
```

---

## Part 2: Logic Decoupling (Pure Functions)

### File Structure

```
lib/
└── tools/
    └── logic/
        ├── index.ts
        ├── unit-conversions/
        │   ├── temperature.ts
        │   ├── distance.ts
        │   ├── weight.ts
        │   └── currency.ts
        ├── calculators/
        │   ├── bmi.ts
        │   ├── loan.ts
        │   └── ...
        └── helpful-calculators/
            ├── recipe-scaler.ts
            └── password-generator.ts
```

### Example Implementation

**lib/tools/logic/unit-conversions/temperature.ts**
```typescript
// Pure conversion functions

export function celsiusToFahrenheit(celsius: number): number {
  if (typeof celsius !== 'number' || isNaN(celsius)) {
    throw new Error('Invalid input');
  }
  return (celsius * 9/5) + 32;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  if (typeof fahrenheit !== 'number' || isNaN(fahrenheit)) {
    throw new Error('Invalid input');
  }
  return (fahrenheit - 32) * 5/9;
}

export function celsiusToKelvin(celsius: number): number {
  if (celsius < -273.15) {
    throw new Error('Below absolute zero');
  }
  return celsius + 273.15;
}

export function convertTemperature(
  value: number,
  from: 'celsius' | 'fahrenheit' | 'kelvin',
  to: 'celsius' | 'fahrenheit' | 'kelvin'
): number {
  if (from === to) return value;

  const converters: Record<string, (n: number) => number> = {
    'celsius_fahrenheit': celsiusToFahrenheit,
    'fahrenheit_celsius': fahrenheitToCelsius,
    'celsius_kelvin': celsiusToKelvin,
    // ... more converters
  };

  const converter = converters[`${from}_${to}`];
  if (!converter) throw new Error('Invalid conversion');

  return converter(value);
}
```

**Usage in component:**
```typescript
import { convertTemperature } from "@/lib/tools/logic/unit-conversions/temperature";

const result = convertTemperature(25, 'celsius', 'fahrenheit');
// No React dependencies, fully testable
```

---

## Step-by-Step Implementation Plan

### Phase 1: Setup Structure (30 min)
1. Create `public/data/` directory
2. Create `public/data/categories/` directory
3. Create `public/data/tools/` subdirectories for each category
4. Create `types/tool-content.ts` with schemas
5. Create `lib/tools/logic/` directory structure

### Phase 2: Create Master & Category JSONs (1 hour)
1. Create `public/data/tools.json` (master index)
2. Create category index files:
   - `public/data/categories/unit-conversions.json`
   - `public/data/categories/calculators.json`
   - `public/data/categories/helpful-calculators.json`
   - `public/data/categories/file-converters.json`
   - `public/data/categories/media-converters.json`

### Phase 3: Migrate High-Priority Tools (4-6 hours)

**Content (JSON files):**
1. Unit Conversions (5 tools):
   - `temperature.json`
   - `distance.json`
   - `weight.json`
   - `volume.json`
   - `currency.json`

2. Calculators (3 tools):
   - `bmi.json`
   - `loan.json`
   - `compound-interest.json`

3. Helpful Calculators (2 tools):
   - `recipe-scaler.json`
   - `crypto-converter.json`

**Logic (TypeScript files):**
1. Extract logic from components to pure functions
2. Create corresponding files in `lib/tools/logic/`
3. Add input validation
4. Write unit tests

### Phase 4: Update Cheatsheet Builder (2 hours)
1. Add template loader (fetch from master JSON)
2. Add template selector UI
3. Add tool-to-cheatsheet converter function
4. Test with migrated tools

### Phase 5: Update Components (2 hours)
1. Import JSON content in pages
2. Import logic functions in pages
3. Replace inline content/logic with imports
4. Test all migrated tools

### Phase 6: Expand Coverage (Ongoing)
1. Migrate remaining 78 tools incrementally
2. Follow same pattern for each tool
3. Update as new tools are added

---

## Implementation Checklist

### Phase 1: Setup ✓
- [ ] Create directory structure
- [ ] Define TypeScript schemas
- [ ] Set up Git tracking for JSON files

### Phase 2: Master & Category JSONs ✓
- [ ] `public/data/tools.json`
- [ ] `public/data/categories/unit-conversions.json`
- [ ] `public/data/categories/calculators.json`
- [ ] `public/data/categories/helpful-calculators.json`
- [ ] `public/data/categories/file-converters.json`
- [ ] `public/data/categories/media-converters.json`

### Phase 3: High-Priority Migration ✓
**Content:**
- [ ] `tools/unit-conversions/temperature.json`
- [ ] `tools/unit-conversions/distance.json`
- [ ] `tools/unit-conversions/weight.json`
- [ ] `tools/unit-conversions/volume.json`
- [ ] `tools/unit-conversions/currency.json`
- [ ] `tools/calculators/bmi.json`
- [ ] `tools/calculators/loan.json`
- [ ] `tools/helpful-calculators/recipe-scaler.json`
- [ ] `tools/helpful-calculators/crypto-converter.json`

**Logic:**
- [ ] `logic/unit-conversions/temperature.ts`
- [ ] `logic/unit-conversions/distance.ts`
- [ ] `logic/unit-conversions/weight.ts`
- [ ] `logic/calculators/bmi.ts`
- [ ] `logic/calculators/loan.ts`
- [ ] `logic/helpful-calculators/recipe-scaler.ts`

### Phase 4: Cheatsheet Builder ✓
- [ ] Add template loader
- [ ] Add template selector UI
- [ ] Add converter function
- [ ] Test with templates

### Phase 5: Update Components ✓
- [ ] Update temperature converter page
- [ ] Update distance converter page
- [ ] Update weight converter page
- [ ] Update BMI calculator page
- [ ] Update loan calculator page
- [ ] Test all pages

---

## Benefits

### Content (JSON)
- ✅ Single source of truth
- ✅ 88+ instant cheatsheet templates
- ✅ Easy to update globally
- ✅ No code changes needed for content updates

### Logic (Functions)
- ✅ Testable pure functions
- ✅ Framework-agnostic
- ✅ Reusable across pages
- ✅ Easy to maintain

### Cheatsheet Builder
- ✅ Access to all tool content
- ✅ Auto-generated templates
- ✅ Consistent formatting
- ✅ LaTeX formulas ready

---

## Example: Temperature Converter Migration

### Before
```tsx
// app/unit-conversions/temperature/page.tsx

export default function TemperatureConverter() {
  // Logic embedded in component
  const convert = (celsius: number) => (celsius * 9/5) + 32;

  return (
    <div>
      <h1>Temperature Converter</h1>
      <AboutDescription
        sections={[
          {
            title: "Formulas",
            content: ["Celsius to Fahrenheit: F = C × 9/5 + 32"]
          }
        ]}
      />
    </div>
  );
}
```

### After
```tsx
// app/unit-conversions/temperature/page.tsx

import { convertTemperature } from "@/lib/tools/logic/unit-conversions/temperature";
import { useEffect, useState } from "react";

export default function TemperatureConverter() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetch('/data/tools/unit-conversions/temperature.json')
      .then(r => r.json())
      .then(setContent);
  }, []);

  // Pure function
  const result = convertTemperature(25, 'celsius', 'fahrenheit');

  return (
    <div>
      <h1>{content?.title}</h1>
      <AboutDescription sections={content?.sections || []} />
    </div>
  );
}
```

---

## Ready to Start?

Total time estimate: **12-16 hours** for high-priority tools

Next action: Create directory structure and master JSON files
