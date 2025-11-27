# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TOOLS WORX is a modern conversion website built with Next.js 14 that provides 88+ professional tools for converting files, units, and creating visualizations. The site uses a modular architecture to easily add new converters and is optimized for SEO and monetization via AdSense.

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build (with increased memory for large build)
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Architecture Overview

### Modular Registry System

The application uses a centralized registry pattern where all tools are defined in category-specific registries and then aggregated in `lib/registry.ts`. This pattern ensures:

- **Single source of truth** for all tools via `allConverters` array
- **Easy discovery** through helper functions (`getConverterById`, `searchConverters`, etc.)
- **Automatic homepage updates** when new tools are added to category registries

**Key files:**
- `lib/registry.ts` - Main aggregator that combines all category registries
- `lib/categories.ts` - Defines category groups with metadata, icons, and SEO keywords
- `lib/categories/{category}/registry.ts` - Individual category tool registries

### Category System

Tools are organized into 7 main categories:
1. **Helpful Calculators** (`helpful-calculators`) - Recipe scaler, Secret Santa, etc.
2. **Unit Conversions** (`unit-conversions`) - Temperature, distance, weight, volume, time, etc.
3. **Calculators** (`calculators`) - Financial, health, and general calculators
4. **File Converters** (`file-converters`) - PDF, Word, Excel, CSV conversions
5. **Media Converters** (`media-converters`) - Image, video, audio conversions
6. **Developer Tools** (`dev-tools`) - JSON formatter, Base64, UUID generator, etc.
7. **Filters** (`filters`) - Image filters, audio effects, data transformations
8. **Charts** (`charts`) - Gantt charts, data visualizations

Each category has:
- Registry file (`registry.ts`) defining all tools in that category
- Template component(s) for rendering tool UI
- Index file exporting tools and templates

### AWS Amplify Backend

The app uses AWS Amplify Gen 2 for backend services:

**Backend structure** (`amplify/backend.ts`):
- `auth` - Cognito authentication
- `data` - GraphQL API schema
- `fileConversion` - Lambda function for file conversions
- `mediaConversion` - Lambda function for media conversions
- `filterService` - Lambda function for applying filters

**Client integration** (`lib/services/amplify-client.ts`):
- Generated GraphQL client from Amplify schema
- Job-based conversion pattern (submit job → poll status → download result)
- Token-based authentication with localStorage persistence

### Page Organization

The application uses Next.js App Router with this structure:

```
app/
├── {category}/           # Category folders (unit-conversions, calculators, etc.)
│   ├── {tool}/
│   │   ├── page.tsx     # Tool page component
│   │   ├── client.tsx   # Client component if needed
│   │   └── metadata.ts  # SEO metadata (optional)
├── {category}-cheatsheet/  # Quick reference pages for each category
├── api/                 # API routes (e.g., import-drive)
├── layout.tsx           # Root layout with header/footer
├── page.tsx             # Homepage
├── sitemap.ts           # Dynamic sitemap generation
└── robots.ts            # Robots.txt generation
```

### Template System

The codebase provides reusable templates for common tool types:

**Unit Conversion Template** (`lib/categories/unit-conversions/template.tsx`):
```tsx
<UnitConversionTemplate
  title="Temperature Converter"
  description="Convert between Celsius and Fahrenheit"
  units={temperatureUnits}
  defaultFromUnit="celsius"
  defaultToUnit="fahrenheit"
  conversionType="temperature"
/>
```

Key features:
- Automatic unit swap
- Copy to clipboard
- Clear/reset functionality
- Quick reference section
- Real-time conversion on Enter key

**Similar templates exist for:**
- File converters (`file-converters/template.tsx`)
- Media converters (`media-converters/template.tsx`)
- Calculators (`calculators/template.tsx`)
- Developer tools (`developer-tools/template.tsx`)

### Service Layer

Services are located in `lib/services/`:

- **amplify-client.ts** - Main Amplify API client with conversion methods
- **conversion-service.ts** - High-level conversion service wrapper
- **share-service.ts** - Share functionality for social media
- **google-drive-service.ts** - Google Drive integration
- **api-client.ts** - General API utilities

### Configuration

**Site configuration** (`config/site.ts`):
- Site metadata (name, description, URL)
- AdSense settings (client ID, enabled flag)
- Google Analytics configuration
- Social links

**Important:** Update `[APP_NAME]` placeholders and AdSense client ID before deployment.

## Adding a New Tool

### 1. Add to Category Registry

Edit the appropriate `lib/categories/{category}/registry.ts`:

```typescript
{
  id: "unique-tool-id",
  title: "Tool Name",
  description: "What this tool does",
  category: "appropriate-category",
  icon: LucideIcon,  // Import from lucide-react
  href: "/category/tool-id",
  keywords: ["keyword1", "keyword2", "keyword3"],
  popular: true,  // Optional: shows on homepage
}
```

### 2. Create Page

Create `app/{category}/{tool-id}/page.tsx`:

```typescript
import { UnitConversionTemplate } from "@/lib/categories/unit-conversions/template"
import { metadata as generateMetadata } from "./metadata"  // Optional

export const metadata = generateMetadata  // If using metadata file

const units = [
  { value: "unit1", label: "Unit 1", abbreviation: "u1" },
  { value: "unit2", label: "Unit 2", abbreviation: "u2" },
]

export default function ToolPage() {
  return (
    <UnitConversionTemplate
      title="Tool Name"
      description="Tool description"
      units={units}
      defaultFromUnit="unit1"
      defaultToUnit="unit2"
      conversionType="temperature"  // or distance, weight, volume, time
    />
  )
}
```

### 3. SEO Metadata (Optional)

Create `app/{category}/{tool-id}/metadata.ts` for custom SEO:

```typescript
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tool Name - TOOLS WORX",
  description: "Detailed description for SEO",
  keywords: ["keyword1", "keyword2"],
  openGraph: {
    title: "Tool Name",
    description: "OG description",
  },
}
```

The tool will automatically appear on:
- Homepage (if `popular: true`)
- Category pages
- Search results
- Sitemap

## Backend Development

When adding backend conversion logic:

1. **Define Lambda function** in `amplify/function/{service-name}/`
2. **Add to backend.ts** to register the function
3. **Update schema** in `amplify/data/resource.ts`
4. **Add client method** in `lib/services/amplify-client.ts`
5. **Deploy:** `amplify publish` or push to trigger AWS Amplify build

## SEO Strategy

The site is heavily optimized for search:

- Each tool has unique title, description, and keywords
- Semantic HTML with proper heading hierarchy
- Open Graph tags for social sharing
- Dynamic sitemap generation (`app/sitemap.ts`)
- Robots.txt configuration (`app/robots.ts`)
- Fast loading with Next.js optimization
- Mobile responsive design

**Target keywords:** "{conversion type} converter" patterns (e.g., "temperature converter", "pdf to word")

## Deployment

### AWS Amplify (Current)
```bash
# Build and deploy
amplify publish

# Or push to main branch - CI/CD handles deployment
git push origin main
```

Build settings configured for Amplify with `NODE_OPTIONS='--max-old-space-size=4096'` for memory-intensive builds.

### Vercel (Alternative)
```bash
vercel deploy
```

## AdSense Integration

AdSense components are pre-configured in `components/ads/`:
1. Get approved by Google AdSense
2. Update `config/site.ts` with your AdSense client ID
3. Set `enabled: true` in config
4. Update ad slot IDs in ad components

## TypeScript Types

Key types are defined in `types/converter.ts`:

- **ConverterMetadata** - Tool definition structure
- **ConverterCategory** - Valid category strings
- **Unit** - Unit definition for conversions
- **FormulaConverterConfig** - Config for formula-based converters
- **FileConverterConfig** - Config for file converters

## Important Patterns

### Client vs Server Components

- **Server components by default** - Most pages are server components for better SEO
- **Client components when needed** - Use `"use client"` directive for:
  - Interactive forms and conversions
  - File uploads
  - State management
  - Browser APIs (localStorage, clipboard)

### File Naming

- `page.tsx` - Server component (default)
- `client.tsx` - Client component (imported by page.tsx)
- `metadata.ts` - Metadata exports (imported by page.tsx)
- `registry.ts` - Tool registry exports

### Styling

- **Tailwind CSS** for all styling
- **shadcn/ui** components in `components/ui/`
- **CSS variables** for theming in `app/globals.css`
- Color scheme: Slate/neutral theme

## Performance Considerations

- Build uses `--max-old-space-size=4096` due to large dependency tree
- Next.js image optimization enabled
- Compression enabled
- Security headers configured in `next.config.js`
- ETag generation disabled for better caching control
