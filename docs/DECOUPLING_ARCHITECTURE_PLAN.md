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

## Part 2: Logic Decoupling (Pure Functions for MCP)

### Why TypeScript for Logic Files?
- **Type Safety**: AI agents get clear input/output contracts
- **JSDoc Support**: Rich documentation for AI understanding
- **MCP Compatible**: Can be directly exposed via Model Context Protocol
- **Framework Agnostic**: Works in Node.js, browser, and AI agents
- **Testable**: Pure functions with no side effects

### Logic File Naming Convention
```
Page: app/calculators/bmi/page.tsx
Logic: lib/tools/logic/calculators/calculator-bmi.ts
MCP: mcp-server/src/tools/calculator-tools.ts (imports logic)

Page: app/unit-conversions/temperature/page.tsx
Logic: lib/tools/logic/unit-conversions/converter-temperature.ts
MCP: mcp-server/src/tools/conversion-tools.ts (imports logic)

Page: app/helpful-calculators/recipe-scaler/page.tsx
Logic: lib/tools/logic/helpful-calculators/calculator-recipe-scaler.ts
MCP: mcp-server/src/tools/calculator-tools.ts (imports logic)
```

### MCP Tool Description Structure
Tool descriptions are embedded in the MCP tool definition (NOT separate files):

```typescript
// mcp-server/src/tools/calculator-tools.ts
import { calculateBMI, BMIInput } from "../../../lib/tools/logic/calculators/calculator-bmi.js";

export const calculatorTools: MCPTool[] = [
  {
    name: "calculate-bmi",
    description: "Calculate Body Mass Index (BMI) from height and weight. Returns BMI value, category, and advice.",
    inputSchema: {
      type: "object",
      properties: {
        weight: { type: "number", description: "Weight (20-500)", minimum: 20, maximum: 500 },
        weightUnit: { type: "string", enum: ["kg", "lbs"] },
        height: { type: "number", description: "Height (50-300)", minimum: 50, maximum: 300 },
        heightUnit: { type: "string", enum: ["cm", "in"] },
      },
      required: ["weight", "weightUnit", "height", "heightUnit"],
    },
    execute: async (args) => {
      const result = calculateBMI(args); // Uses decoupled logic
      return result;
    },
  },
];
```

### Logic File Template
```typescript
/**
 * [Tool Name] - Business Logic
 * 
 * Pure functions for [description]
 * MCP-compatible for AI agent integration
 * 
 * @module tools/logic/[category]/[tool-name]
 */

// Input/Output Types
export interface [Tool]Input {
  // Input parameters with validation rules
}

export interface [Tool]Output {
  // Output structure
}

// Validation
export function validate[Tool]Input(input: [Tool]Input): string | null {
  // Return error message or null if valid
}

// Main Logic
export function calculate[Tool](input: [Tool]Input): [Tool]Output {
  // Pure calculation logic
}

// Helper functions (if needed)
function helperFunction(param: type): type {
  // Internal helpers
}
```

---

## Part 2 (Original): Logic Decoupling (Pure Functions)

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

## Actual Implementation Procedure

### Phase 1: Content Migration (Completed)
1. Created `public/data/` directory structure
2. Created master `tools.json` and category index files
3. Migrated all 88+ tools to JSON format
4. Established content schema with TypeScript types

### Phase 2: Logic Decoupling (In Progress)
**Per-Category Process:**
1. **Identify tools** - List all tools in category
2. **Read pages** - Examine page.tsx files to identify business logic
3. **Create logic files** - Extract pure functions to `lib/tools/logic/[category]/`
   - Define Input/Output TypeScript interfaces
   - Implement validation functions
   - Extract core business logic as pure functions
   - Add JSDoc comments for MCP compatibility
4. **Refactor pages** - Update page components to use logic functions
   - Import logic functions
   - Create thin wrapper functions (e.g., handleCalculate)
   - Replace inline logic with function calls
   - Maintain UI/UX behavior
5. **Test** - Verify functionality remains unchanged

**Naming Conventions:**
- Calculators: `calculator-[name].ts`
- Charts: `chart-[type].ts`
- Dev Tools: `tool-[name].ts`
- Filters: `filter-[name].ts`
- Converters: `converter-[name].ts`

### Phase 3: MCP Integration (Pending)
1. Create MCP tool definitions in `mcp-server/src/tools/`
2. Import and expose logic functions via MCP
3. Test AI agent access to tools
4. Document MCP endpoints

### Phase 4: Testing & Validation (Ongoing)
1. Manual testing of refactored pages
2. Verify type safety with TypeScript
3. Ensure no regression in functionality

---

## Implementation Checklist

### Phase 1: Setup ✅
- [x] Create directory structure
- [x] Define TypeScript schemas
- [x] Set up Git tracking for JSON files

### Phase 2: Master & Category JSONs ✅
- [x] `public/data/tools.json`
- [x] `public/data/categories/unit-conversions.json`
- [x] `public/data/categories/calculators.json`
- [x] `public/data/categories/helpful-calculators.json`
- [x] `public/data/categories/file-converters.json`
- [x] `public/data/categories/media-converters.json`

### Phase 3: Content Migration ✅ COMPLETE
**Content JSON files created for all tools**
- [x] All unit conversion tools
- [x] All calculator tools
- [x] All helpful calculator tools
- [x] All file converter tools
- [x] All media converter tools

### Phase 4: Logic Decoupling 🚧 IN PROGRESS
**Goal:** Extract business logic into pure TypeScript functions for MCP integration

**Completed Categories:**

#### Calculators (12/12 tools) ✅
- [x] `calculator-bmi.ts` - BMI calculation with classification
- [x] `calculator-calorie.ts` - Daily calorie needs (BMR + activity)
- [x] `calculator-concrete.ts` - Concrete volume and cost
- [x] `calculator-date.ts` - Date difference calculations
- [x] `calculator-flooring.ts` - Flooring materials and cost
- [x] `calculator-loan.ts` - Loan payment calculations
- [x] `calculator-mortgage.ts` - Mortgage amortization
- [x] `calculator-paint.ts` - Paint quantity estimation
- [x] `calculator-percentage.ts` - Percentage calculations
- [x] `calculator-pregnancy.ts` - Due date and trimester tracking
- [x] `calculator-protein.ts` - Daily protein requirements
- [x] `calculator-tip.ts` - Tip and bill splitting

#### Charts (5/8 tools) ✅
- [x] `chart-area.ts` - D3 area chart rendering
- [x] `chart-bar.ts` - D3 bar chart rendering
- [x] `chart-line.ts` - D3 line chart rendering
- [x] `chart-pie.ts` - D3 pie chart rendering
- [x] `chart-scatter.ts` - D3 scatter plot rendering
- [x] `chart-utils.ts` - Shared D3 utilities
- ⏭️ Gantt, Sunburst, USA Map - Skipped (complex external integrations)

#### Dev-Tools (14/14 tools) ✅
- [x] `tool-base64.ts` - Base64 encode/decode
- [x] `tool-csv.ts` - CSV parsing, formatting, JSON conversion
- [x] `tool-email.ts` - Email address extraction
- [x] `tool-hash.ts` - Hash generation (MD5, SHA1, SHA256)
- [x] `tool-json.ts` - JSON format/minify/validate
- [x] `tool-jwt.ts` - JWT token decoding
- [x] `tool-regex.ts` - Regex testing and highlighting
- [x] `tool-text-case.ts` - 8 case format conversions
- [x] `tool-timestamp.ts` - Unix timestamp conversions
- [x] `tool-url.ts` - URL encode/decode/extract
- [x] `tool-uuid.ts` - UUID v4 generation
- [x] `tool-xml.ts` - XML format/minify/validate

#### Helpful-Calculators (6/6 tools) ✅
- [x] `helper-crypto.ts` - Cryptocurrency conversion
- [x] `helper-holiday.ts` - Holiday countdown with Easter/Thanksgiving
- [x] `helper-password.ts` - Secure password generation
- [x] `helper-recipe.ts` - Recipe ingredient scaling
- [x] `helper-secret-santa.ts` - Secret Santa assignments
- [x] `helper-shipping.ts` - Shipping cost estimation

#### Unit-Conversions (12/12 tools) ✅
- [x] `converter.ts` - Universal unit converter (area, data, length, mass, pressure, speed, time, volume)
- [x] `currency.ts` - Currency conversion with exchange rates
- [x] `temperature.ts` - Temperature scale conversions (Celsius, Fahrenheit, Kelvin, Rankine)
- [x] `spacetime.ts` - Lorentz transformation for special relativity
- [x] Energy uses existing logic from lib/categories/unit-conversions/logic.ts
- Note: 8 tools use factor-based universal converter, 4 have custom logic

**Summary: 43 tools decoupled across 5 categories**

**Skipped Categories (Backend Processing):**
- ⏭️ File-Converters (19 tools) - Backend with LibreOffice
- ⏭️ Filters (25 tools) - Backend with FFmpeg/Sharp
- ⏭️ Media-Converters (25 tools) - Backend with FFmpeg

**Total Progress: 43/88+ tools (49%) - All client-side logic decoupled ✅**

### Phase 5: MCP Integration ⏳ PENDING
- [ ] Create MCP tool definitions for decoupled logic
- [ ] Export logic functions via MCP server
- [ ] Test AI agent access to tools
- [ ] Document MCP endpoints and usage

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

## Progress Summary

**Completed:**
- ✅ Phase 1: Setup & Structure
- ✅ Phase 2: Master & Category JSONs
- ✅ Phase 3: Content Migration (88+ tools)
- 🚧 Phase 4: Logic Decoupling (31/88+ tools = 35%)
  - ✅ Calculators: 12 tools
  - ✅ Charts: 5 tools (3 skipped)
  - ✅ Dev-Tools: 14 tools

**Next Steps:**
1. Continue logic decoupling for remaining categories
2. Prioritize high-traffic tools (File-Converters, Unit-Conversions)
3. Begin MCP integration for completed tools

**Next Phase: MCP Integration**
- Create MCP tool definitions for 43 decoupled tools
- Export logic functions via MCP server
- Test AI agent access
- Estimated effort: 4-6 hours

**Backend Tools (Future Work):**
- File/Media/Filter converters require backend API integration
- Will create MCP-compatible APIs after logic decoupling complete
- Estimated effort: 8-12 hours for MCP API wrappers
