# Tools Worx (convert-all) - Project Context

## Project Overview

**Tools Worx** is a modern, SEO-optimized online conversion platform built with **Next.js 16** and **React**. The site provides 88+ free conversion tools across multiple categories including unit conversions, file converters, media converters, calculators, developer tools, and adventure planning tools.

**Live Site:** https://toolsworx.com  
**Repository:** https://github.com/McKhanster/convert-all

### Architecture

- **Frontend:** Next.js 16 (App Router) hosted on Firebase App Hosting
- **Backend:** Cloud Run service (`unified-service-905466639122.us-east5.run.app`)
- **Database:** Firestore (Native mode)
- **Infrastructure:** Terraform-managed AWS resources + GCP services
- **Styling:** Tailwind CSS with shadcn/ui components
- **Language:** TypeScript (strict mode)

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.9+ |
| Styling | Tailwind CSS + shadcn/ui |
| UI Components | Radix UI primitives |
| Icons | Lucide React |
| Math/Formula | Math.js |
| PDF | jsPDF, html2canvas |
| Charts | D3.js |
| Auth | Firebase Authentication |
| Cloud | Firebase App Hosting, GCP Cloud Functions, Cloud Run |
| IaC | Terraform (AWS + GCP) |

## Project Structure

```
convert-all/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Homepage
│   ├── globals.css               # Global styles
│   └── [category]/               # Category route segments
│       └── [tool]/page.tsx       # Individual tool pages
├── components/
│   ├── ui/                       # shadcn/ui base components
│   ├── layout/                   # Header, Footer, Navigation
│   ├── shared/                   # Shared feature components
│   ├── seo/                      # SEO metadata components
│   └── account/                  # Account/auth components
├── lib/
│   ├── registry.ts               # Master tool registry
│   ├── categories.ts             # Category group definitions
│   ├── categories/               # Per-category registries
│   │   ├── unit-conversions/
│   │   ├── calculators/
│   │   ├── file-converters/
│   │   ├── media-converters/
│   │   ├── developer-tools/
│   │   ├── helpful-calculators/
│   │   ├── adventure/
│   │   ├── charts/
│   │   ├── filters/
│   │   └── blog/
│   ├── tools/logic/              # Tool implementation logic
│   ├── services/                 # API service layers
│   ├── firebase/                 # Firebase utilities
│   ├── hooks/                    # Custom React hooks
│   └── utils/                    # Utility functions
├── config/
│   └── site.ts                   # Site configuration & SEO
├── types/
│   └── converter.ts              # TypeScript type definitions
├── gcp-functions/                # GCP Cloud Functions (rates API)
├── terraform/                    # Infrastructure as Code
│   ├── main.tf                   # Main orchestration
│   ├── variables.tf              # Variable definitions
│   ├── prod.tfvars               # Production values
│   ├── networking/               # VPC, subnets
│   ├── compute/                  # ECS/Fargate configs
│   ├── monitoring/               # CloudWatch, alarms
│   └── data/                     # RDS, Redis
├── scripts/
│   ├── run-tool-tests.ts         # Test runner
│   ├── test-conversions.js       # Conversion tests
│   └── bundle-unified-service.sh # Backend bundling
└── docs/                         # Documentation
```

## Building and Running

### Prerequisites

- Node.js 22+
- npm
- GCP CLI (`gcloud`) for deployment
- Terraform 1.5+ for infrastructure

### Local Development

```bash
# Install dependencies
npm install

# Copy environment example and configure
cp .env.local.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

Open http://localhost:3000

### Build & Production

```bash
# Production build (4GB heap limit)
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Run tests
npm run test
npm run test:tools
```

### Environment Variables

Key variables in `.env.local`:

```bash
# API Configuration
NEXT_PUBLIC_CONVERTER_API_URL=https://unified-service-905466639122.us-east5.run.app
NEXT_PUBLIC_CONVERTER_API_KEY=your-api-key
NEXT_PUBLIC_SITE_URL=https://toolsworx.com

# Firebase (client)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...

# Google APIs
NEXT_PUBLIC_GOOGLE_API_KEY=...
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## Tool Categories

The platform organizes tools into these category groups:

| Category | Description | Tools Count |
|----------|-------------|-------------|
| Helpful Calculators | Recipe scaler, password generator, crypto/fiat converters | 10+ |
| Unit Conversions | Temperature, distance, weight, volume, time, speed, area, energy, pressure, data | 20+ |
| Calculators | Mortgage, BMI, loan, percentage, tip, date, scientific, graphing | 15+ |
| File Converters | Document, spreadsheet, data, encoding, archive conversions | 15+ |
| Media Converters | Image, video, audio format conversions | 10+ |
| Developer Tools | JSON formatter, validators, encoders, generators | 10+ |
| Filters | Image, audio, and data filtering tools | 5+ |
| Charts | D3.js-based visualization tools | 5+ |
| Adventure Tools | Travel planning, route calculators, packing lists | 10+ |
| Blog | Travel stories and tool application examples | Dynamic |

## Adding a New Tool

### Step 1: Add to Category Registry

Edit the appropriate registry file in `lib/categories/[category]/registry.ts`:

```typescript
{
  id: "my-new-tool",
  title: "My New Tool",
  description: "Description of what it does",
  category: "helpful",  // Must match category folder
  icon: Calculator,     // Lucide icon import
  href: "/helpful-calculators/my-new-tool",
  keywords: ["keyword1", "keyword2"],
  popular: true,        // Optional: show on homepage
}
```

### Step 2: Create the Page

Create `app/[category]/my-new-tool/page.tsx`:

```typescript
"use client"

import { Card } from "@/components/ui/card"

export default function MyNewToolPage() {
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-4">My New Tool</h1>
      <p className="text-muted-foreground mb-8">Description</p>
      {/* Tool implementation */}
    </div>
  )
}
```

### Step 3: Add SEO Metadata

Use the `metadata-generator.ts` utility or add inline:

```typescript
export const metadata = {
  title: "My New Tool - Tools Worx",
  description: "Free online tool for...",
}
```

## Deployment

### Frontend (Firebase App Hosting)

```bash
# Deploy to production
firebase apphosting:deploy
```

### Backend (Cloud Run)

See `backend/unified-service/README.md` for Docker build/push commands.

### GCP Functions (Rates API)

```bash
cd gcp-functions
gcloud functions deploy ratesApi \
  --gen2 \
  --runtime=nodejs22 \
  --region=us-central1 \
  --trigger-http \
  --allow-unauthenticated
```

### Infrastructure (Terraform)

```bash
cd terraform
terraform init
terraform plan -var-file=prod.tfvars
terraform apply -var-file=prod.tfvars
```

## Key Configuration Files

| File | Purpose |
|------|---------|
| `config/site.ts` | Site name, URL, AdSense config, SEO keywords |
| `lib/categories.ts` | Category group definitions with SEO content |
| `lib/registry.ts` | Master tool registry combining all categories |
| `next.config.js` | Next.js configuration, security headers |
| `tsconfig.json` | TypeScript config with path aliases (`@/*`) |
| `tailwind.config.mjs` | Tailwind theme customization |

## Monetization

### Google AdSense

Configured in `config/site.ts`:

```typescript
adsense: {
  client: "ca-pub-8286321884742507",
  enabled: true,
}
```

Ad components are in `components/ads/`.

### Revenue Model

- Free tools with ad placements
- Premium API access (future)
- No file size limits to maximize engagement

## Development Conventions

### Code Style

- TypeScript-first, strict mode enabled
- Functional React components with hooks
- PascalCase for components, camelCase for functions
- Tailwind CSS for all styling
- Let Prettier/ESLint handle formatting

### File Naming

- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Route folders: `kebab-case`
- Tests: `*.test.ts` or `*.test.tsx`

### Git Workflow

```bash
# Branch naming
feature/new-tool
fix/conversion-bug

# Commit style: imperative, concise
git commit -m "add recipe scaler tool"
git commit -m "fix currency conversion rounding"
```

## Testing

```bash
# Run all tests
npm run test

# Run tool-specific tests
npm run test:tools

# Manual testing fixtures
tests/docs/  # Sample files for upload/convert testing
```

## Important Links

- **Setup Guide:** `docs/SETUP_GUIDE.md` (referenced in README)
- **Framework Docs:** `docs/FRAMEWORK_RECOMMENDATIONS.md`
- **Cost Analysis:** `docs/AWS_COST_REVENUE_ANALYSIS.md`
- **AdSense Policy:** `docs/adsense-policy.md`
- **Tool List:** `docs/tools-list.md`

## Common Tasks

### Update Site Branding

Edit `config/site.ts` - changes propagate to all pages.

### Add Ad Placements

Create component in `components/ads/` and import where needed.

### Modify Category SEO

Edit `lib/categories.ts` - each `CategoryGroup` has extensive SEO content.

### Debug Tool Issues

1. Check tool registry entry
2. Verify page path matches `href` in registry
3. Check console for hydration errors
4. Test with `npm run lint && npm run build`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails with OOM | Increase Node heap: `NODE_OPTIONS='--max-old-space-size=4096'` |
| Tool not appearing | Check registry entry, verify category matches folder |
| SEO not updating | Clear `.next/` cache, rebuild |
| API errors | Verify `NEXT_PUBLIC_CONVERTER_API_URL` in `.env.local` |
| Firebase deploy fails | Check `.firebaserc` project config |
