# Cheatsheet Builder Implementation Plan

## Overview

A tool that allows users to create custom cheatsheets with LaTeX support for mathematical expressions, with export options to PDF, TXT, and DOCX formats.

---

## Data Structure

### JSON Schema

```typescript
interface CheatsheetData {
  // Core metadata
  title: string;
  date: string; // ISO 8601 format (YYYY-MM-DD)
  subject: string;

  // Additional metadata
  author?: string;
  category?: string;
  tags?: string[];
  version?: string;

  // Styling options
  layout?: 'single' | 'double'; // Column layout
  fontSize?: 'small' | 'medium' | 'large';
  colorScheme?: 'default' | 'blue' | 'green' | 'purple';

  // Content items
  items: CheatsheetItem[];
}

interface CheatsheetItem {
  subtitle: string; // Section title
  description: string; // Content (supports LaTeX)
  type?: 'text' | 'formula' | 'code' | 'list'; // Content type hint
  importance?: 'normal' | 'high'; // Visual emphasis
}
```

### Example JSON

```json
{
  "title": "Calculus I Quick Reference",
  "date": "2025-12-02",
  "subject": "Mathematics",
  "author": "Student Name",
  "category": "Math",
  "tags": ["calculus", "derivatives", "integrals"],
  "version": "1.0",
  "layout": "double",
  "fontSize": "medium",
  "colorScheme": "blue",
  "items": [
    {
      "subtitle": "Derivative Rules",
      "description": "Power Rule: $\\frac{d}{dx}x^n = nx^{n-1}$",
      "type": "formula",
      "importance": "high"
    },
    {
      "subtitle": "Chain Rule",
      "description": "$\\frac{d}{dx}f(g(x)) = f'(g(x)) \\cdot g'(x)$",
      "type": "formula",
      "importance": "high"
    },
    {
      "subtitle": "Product Rule",
      "description": "$\\frac{d}{dx}[f(x)g(x)] = f'(x)g(x) + f(x)g'(x)$",
      "type": "formula",
      "importance": "normal"
    }
  ]
}
```

---

## Features

### 1. Builder Interface

**Layout:**
- Left panel: Form builder with inputs
- Right panel: Live preview of cheatsheet

**Form Components:**
- Title input
- Date picker
- Subject input
- Author input (optional)
- Category/Tags input
- Dynamic item list with Add/Remove buttons
- Each item has:
  - Subtitle input
  - Description textarea (with LaTeX preview)
  - Type selector
  - Importance toggle

### 2. LaTeX Support

**Library:** KaTeX (faster than MathJax, no external dependencies)

**Features:**
- Inline math: `$formula$`
- Display math: `$$formula$$`
- Live preview as user types
- Common LaTeX templates dropdown (fractions, integrals, summations, etc.)

**Installation:**
```bash
npm install katex react-katex
```

### 3. Templates

Pre-built templates for common use cases:

**Mathematics:**
- Calculus I
- Linear Algebra
- Statistics
- Trigonometry

**Programming:**
- JavaScript ES6
- Python Quick Reference
- SQL Commands
- Git Commands

**Sciences:**
- Chemistry Formulas
- Physics Equations
- Biology Terminology

**Languages:**
- Spanish Vocabulary
- French Grammar
- German Articles

### 4. Export Functionality

#### PDF Export
**Library:** `jspdf` + `html2canvas`

```typescript
async function exportToPDF(data: CheatsheetData) {
  // Render cheatsheet to hidden div
  // Use html2canvas to capture as image
  // Add image to jsPDF
  // Download
}
```

**Features:**
- Preserve LaTeX rendering
- Maintain layout and colors
- Professional formatting

#### TXT Export
**Implementation:** Simple text conversion

```typescript
function exportToTXT(data: CheatsheetData): string {
  let text = `${data.title}\n`;
  text += `Subject: ${data.subject}\n`;
  text += `Date: ${data.date}\n\n`;

  data.items.forEach(item => {
    text += `## ${item.subtitle}\n`;
    text += `${item.description}\n\n`;
  });

  return text;
}
```

**Note:** LaTeX will be exported as raw text (e.g., `$x^2$`)

#### DOCX Export
**Library:** `docx`

```typescript
import { Document, Paragraph, TextRun } from 'docx';

function exportToDOCX(data: CheatsheetData) {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          text: data.title,
          heading: 'Heading1'
        }),
        // Add items...
      ]
    }]
  });

  return doc;
}
```

**Note:** LaTeX formulas will need to be converted to Office Math or rendered as images

---

## Implementation Steps

### Phase 1: Core Structure (Week 1)

**Tasks:**
1. Create type definitions (`types/cheatsheet.ts`)
2. Add to helpful-calculators registry
3. Create basic page layout
4. Implement JSON builder form
5. Add/remove items functionality

### Phase 2: LaTeX Support (Week 1-2)

**Tasks:**
1. Install KaTeX dependencies
2. Create LaTeX preview component
3. Add LaTeX template dropdown
4. Implement live preview panel

### Phase 3: Export Features (Week 2)

**Tasks:**
1. Implement TXT export (easiest)
2. Implement PDF export with html2canvas
3. Implement DOCX export
4. Add download buttons

### Phase 4: Templates & Polish (Week 2-3)

**Tasks:**
1. Create 10-15 pre-built templates
2. Add template selector
3. Add import JSON functionality
4. Styling and responsive design
5. Testing across browsers

---

## Technology Stack

### Dependencies

```json
{
  "dependencies": {
    "katex": "^0.16.9",
    "react-katex": "^3.0.1",
    "jspdf": "^2.5.1",
    "html2canvas": "^1.4.1",
    "docx": "^8.5.0",
    "file-saver": "^2.0.5"
  }
}
```

### File Structure

```
app/helpful-calculators/cheatsheet-builder/
├── page.tsx                    # Main page component
├── components/
│   ├── CheatsheetForm.tsx     # Left panel: Form builder
│   ├── CheatsheetPreview.tsx  # Right panel: Live preview
│   ├── LatexInput.tsx         # Textarea with LaTeX support
│   ├── TemplateSelector.tsx   # Template picker
│   └── ExportButtons.tsx      # PDF/TXT/DOCX export
├── templates/
│   ├── math-calculus.json
│   ├── math-algebra.json
│   ├── programming-js.json
│   └── ... (more templates)
└── utils/
    ├── latex-renderer.ts      # KaTeX wrapper
    ├── export-pdf.ts          # PDF export logic
    ├── export-txt.ts          # TXT export logic
    └── export-docx.ts         # DOCX export logic

types/cheatsheet.ts             # TypeScript definitions
lib/categories/helpful-calculators/registry.ts  # Add entry
```

---

## UI/UX Design

### Layout (Desktop)

```
+-----------------------------------+-----------------------------------+
|                                   |                                   |
|  CHEATSHEET BUILDER               |  LIVE PREVIEW                     |
|                                   |                                   |
|  [Template Selector Dropdown]     |  +-----------------------------+  |
|                                   |  | Calculus I Quick Reference  |  |
|  Title: [________________]        |  | Mathematics | 2025-12-02     |  |
|  Subject: [______________]        |  +-----------------------------+  |
|  Date: [__/__/____]               |                                   |
|  Author: [____________]           |  ## Derivative Rules              |
|                                   |     d                             |
|  Items:                           |    -- x^n = nx^(n-1)              |
|  +---------------------------+    |    dx                             |
|  | Subtitle: Derivative Rules|    |                                   |
|  | Description:              |    |  ## Chain Rule                    |
|  | $\frac{d}{dx}x^n = ...$  |    |    d                              |
|  | [LaTeX Preview Below]     |    |   -- f(g(x)) = f'(g(x))·g'(x)    |
|  |                           |    |   dx                              |
|  | [Remove] [▲] [▼]          |    |                                   |
|  +---------------------------+    |  [Export: PDF | TXT | DOCX]       |
|  [+ Add Item]                     |                                   |
|                                   |                                   |
|  [Import JSON] [Export JSON]      |                                   |
|  [Export to PDF/TXT/DOCX]         |                                   |
+-----------------------------------+-----------------------------------+
```

### Layout (Mobile)

Tabs: "Build" and "Preview"

---

## Cost Analysis

### AWS Costs
- **Zero additional cost** - All processing done client-side in browser
- No Lambda, no storage, no API calls

### Libraries
- All dependencies are open-source and free
- KaTeX: MIT License
- jsPDF: MIT License
- docx: MIT License

---

## SEO & Keywords

**Target Keywords:**
- cheatsheet maker
- cheat sheet generator
- study guide creator
- formula sheet builder
- latex cheatsheet maker
- printable cheatsheet creator
- exam reference sheet maker

**Description:**
"Create custom cheatsheets with LaTeX support for mathematical formulas. Perfect for exams, studying, and quick reference. Export to PDF, TXT, or DOCX."

---

## Future Enhancements (Phase 2+)

1. **Cloud Save** - Save cheatsheets to user account (requires auth)
2. **Public Gallery** - Share cheatsheets with community
3. **Collaboration** - Multiple users edit same cheatsheet
4. **More Layouts** - Grid, card-based, mind map styles
5. **Images** - Embed diagrams and illustrations
6. **Print Optimization** - Better page breaks for printing
7. **Mobile App** - React Native version
8. **AI Assistant** - Generate cheatsheet from syllabus/textbook

---

## Success Metrics

**Target (3 months):**
- 500+ cheatsheets created per month
- 10% of users export to PDF
- 5% conversion to premium (future monetization)
- Ad revenue: $50-100/month from this tool alone

**Premium Features (Future):**
- Unlimited cloud saves
- Advanced templates
- Custom branding
- Team collaboration

---

## Implementation Priority

**Priority 1 (MVP - 1 week):**
- ✅ Basic form builder
- ✅ JSON import/export
- ✅ LaTeX rendering with KaTeX
- ✅ PDF export
- ✅ TXT export
- ✅ 3-5 basic templates

**Priority 2 (1-2 weeks):**
- ✅ DOCX export
- ✅ Advanced styling options
- ✅ 10+ templates
- ✅ Mobile responsive
- ✅ Better UX/UI polish

**Priority 3 (Future):**
- Cloud save
- Gallery
- Collaboration
- AI assistant

---

## Ready to Implement

Let me know if this plan looks good, and I'll start implementing:

1. Type definitions
2. Basic page structure
3. Form builder
4. LaTeX support
5. Export functionality
6. Templates

Or if you want to adjust anything in the plan first!
