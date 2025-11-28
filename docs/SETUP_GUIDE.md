# Setup Guide - Conversion Website

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Configure Your App Name

Open `config/site.ts` and replace `[APP_NAME]` with your app name:

```typescript
export const siteConfig = {
  name: "ConvertAll", // Replace [APP_NAME] with your app name
  description: "...",
  url: "https://your-domain.com", // Replace with your domain
  // ...
}
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your website.

---

## 📁 Project Structure

```
convert-all/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with Header/Footer
│   ├── page.tsx                 # Homepage with converter gallery
│   ├── globals.css              # Global styles & Tailwind
│   └── convert/                 # Converter pages
│       ├── celsius-fahrenheit/
│       ├── km-miles/
│       ├── kg-lbs/
│       ├── image-converter/
│       └── ...
├── components/
│   ├── layout/                  # Layout components
│   │   ├── header.tsx
│   │   └── footer.tsx
│   ├── ads/                     # AdSense components
│   │   └── ad-unit.tsx
│   ├── converters/              # Reusable converter components
│   │   ├── converter-card.tsx   # Card for converter gallery
│   │   ├── formula-converter.tsx # Template for formula converters
│   │   └── file-dropzone.tsx    # Drag & drop file upload
│   └── ui/                      # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ...
├── lib/
│   ├── utils.ts                 # Utility functions
│   └── converters/
│       ├── registry.ts          # Central registry of all converters
│       └── formula-converters.ts # Conversion logic using Math.js
├── types/
│   └── converter.ts             # TypeScript types
├── config/
│   └── site.ts                  # Site configuration & AdSense
└── public/                      # Static assets
```

---

## ➕ Adding New Converters

### Option 1: Formula-Based Converter (Temperature, Distance, etc.)

**Step 1:** Add to registry (`lib/converters/registry.ts`):

```typescript
{
  id: "inches-cm",
  title: "Inches to Centimeters",
  description: "Convert inches to centimeters",
  category: "distance",
  icon: Ruler,
  href: "/convert/inches-cm",
  keywords: ["inches", "centimeters", "distance"],
  popular: false,
}
```

**Step 2:** Create page (`app/convert/inches-cm/page.tsx`):

```typescript
import { Metadata } from "next"
import { FormulaConverter } from "@/components/converters/formula-converter"
import { convertDistance } from "@/lib/converters/formula-converters"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"

export const metadata: Metadata = {
  title: "Inches to Centimeters Converter",
  description: "Convert inches to centimeters instantly",
  keywords: ["inches", "cm", "centimeters", "converter"],
}

const units = [
  { value: "inch", label: "Inches", abbreviation: "in" },
  { value: "cm", label: "Centimeters", abbreviation: "cm" },
]

export default function InCmPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <FormulaConverter
            title="Inches to Centimeters"
            description="Convert between inches and centimeters"
            units={units}
            defaultFromUnit="inch"
            defaultToUnit="cm"
            onConvert={convertDistance}
          />
          <FooterAd />
        </div>
        <div className="lg:col-span-1">
          <SidebarAd />
        </div>
      </div>
    </div>
  )
}
```

**That's it!** The converter will automatically appear on the homepage.

### Option 2: File-Based Converter (Images, Documents, etc.)

Use the `FileDropzone` component and create custom conversion logic.

See `app/convert/image-converter/page.tsx` for an example.

---

## 🎨 Customization

### Change Colors

Edit `app/globals.css` to customize the color scheme:

```css
:root {
  --primary: 221.2 83.2% 53.3%;  /* Change primary color */
  --secondary: 210 40% 96.1%;    /* Change secondary color */
  /* ... */
}
```

### Add Custom Fonts

Edit `app/layout.tsx`:

```typescript
import { YourFont } from "next/font/google"

const yourFont = YourFont({ subsets: ["latin"] })
```

### Modify Header/Footer

Edit:
- `components/layout/header.tsx`
- `components/layout/footer.tsx`

---

## 🔍 SEO Optimization

### Already Implemented:

✅ **Server-Side Rendering (SSR)** - Next.js provides SSR out of the box
✅ **Meta Tags** - Each page has unique title, description, keywords
✅ **Open Graph** - Social media sharing optimized
✅ **Semantic HTML** - Proper heading hierarchy
✅ **Mobile Responsive** - Tailwind CSS responsive design
✅ **Fast Loading** - Optimized components and code splitting

### To Improve SEO Further:

1. **Add Sitemap**
   - Create `app/sitemap.ts` (Next.js auto-generates XML)

2. **Add robots.txt**
   - Create `app/robots.ts`

3. **Add Structured Data**
   - Already in layout.tsx, customize per page

4. **Content Marketing**
   - Add blog posts about conversions
   - Create "how to" guides
   - Add conversion tables

5. **Build Backlinks**
   - Submit to tool directories
   - Guest post on relevant blogs
   - List on converter tool lists

---

## 🚢 Deployment

### Option 1: Vercel (Easiest)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

✅ **Pros**: Zero config, automatic HTTPS, CDN, free tier
❌ **Cons**: Lambda timeouts (10s hobby, 60s pro)

### Option 2: AWS Amplify

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

✅ **Pros**: Full AWS integration, custom timeouts
❌ **Cons**: More complex setup

### Option 3: Docker + AWS ECS/Fargate

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

✅ **Pros**: Full control, scalable
❌ **Cons**: Most complex, higher cost

### Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
```

---

## 🔧 Backend Implementation (File Conversions)

### Image Conversion with Sharp

**Step 1:** Install Sharp

```bash
npm install sharp
```

**Step 2:** Create API route (`app/api/convert/image/route.ts`):

```typescript
import { NextRequest } from 'next/server'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  const format = formData.get('format') as string

  const buffer = Buffer.from(await file.arrayBuffer())

  const converted = await sharp(buffer)
    .toFormat(format as any)
    .toBuffer()

  return new Response(converted, {
    headers: {
      'Content-Type': `image/${format}`,
      'Content-Disposition': `attachment; filename="converted.${format}"`,
    },
  })
}
```

**Step 3:** Update `image-converter/page.tsx` to call this API.

### PDF to Word with LibreOffice (AWS Lambda)

See `FRAMEWORK_RECOMMENDATIONS.md` for detailed implementation.

---

## 📊 Analytics Setup

### Google Analytics

Add to `app/layout.tsx`:

```typescript
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

---

## 🧪 Testing

```bash
# Run linter
npm run lint

# Build for production (test for errors)
npm run build

# Run production build locally
npm start
```

---

## 📈 Growth Strategy

### Phase 1: Launch (Month 1-2)
- Deploy with 10-15 converters
- Submit to Google
- Basic SEO setup
- Goal: 1,000-5,000 visitors/month

### Phase 2: Content (Month 3-6)
- Add 30+ converters
- Create blog content
- Build backlinks
- Goal: 10,000-50,000 visitors/month

### Phase 3: Monetization (Month 6+)
- Optimize ad placements
- Add premium features
- Consider API access
- Goal: 100,000+ visitors/month

---

## 🆘 Troubleshooting

### Build Errors

**Error**: `Module not found: Can't resolve 'mathjs'`
**Fix**: `npm install mathjs`

**Error**: TypeScript errors
**Fix**: `npm install --save-dev @types/node @types/react @types/react-dom`

### AdSense Not Showing

1. Check `siteConfig.adsense.enabled` is `true`
2. Verify client ID is correct
3. AdSense needs 24-48 hours after approval
4. Check browser ad blocker is disabled

### Math.js Conversion Errors

Math.js uses specific unit names:
- Temperature: `celsius`, `fahrenheit`, `kelvin`
- Distance: `meter`, `km`, `mile`, `feet`, `inch`
- Weight: `kg`, `g`, `lb`, `oz`

See Math.js documentation for full list: https://mathjs.org/

---

## 📚 Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Math.js**: https://mathjs.org
- **Google AdSense**: https://support.google.com/adsense

---

## 🤝 Contributing

To add more converters:

1. Add to `lib/converters/registry.ts`
2. Create page in `app/convert/[name]/page.tsx`
3. Test locally
4. Deploy

---

## 📄 License

This project is open source and available for personal or commercial use.

---

## 💡 Tips for Success

1. **Focus on SEO** - Each converter page is a landing page
2. **Add many converters** - More pages = more traffic
3. **Fast load times** - Critical for Google rankings and ad revenue
4. **Mobile first** - Most traffic will be mobile
5. **Update regularly** - Add new converters monthly
6. **Track everything** - Use Google Analytics and Search Console

Good luck with your conversion website! 🚀
