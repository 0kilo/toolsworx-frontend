# TOOLS WORX - Free Online Conversion Tools

A modern, fast, and SEO-optimized conversion website built with Next.js 16 and React. Convert documents, images, videos, and units instantly.

## ✨ Features

- 🎯 **Modular Architecture** - Easily add new converters
- 📱 **Fully Responsive** - Works perfectly on all devices
- 🚀 **SEO Optimized** - Built-in meta tags, Open Graph, semantic HTML
- 💰 **AdSense Ready** - Pre-configured ad placements
- ⚡ **Fast Performance** - Next.js SSR, optimized loading
- 🎨 **Modern UI** - Beautiful design with Tailwind CSS & shadcn/ui
- 🔧 **TypeScript** - Type-safe development
- 📊 **Math.js Integration** - Automatic unit conversions

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure your app name
# Edit config/site.ts and replace [APP_NAME]

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 What's Included

### Working Converters (10+)
- ✅ Temperature (Celsius ↔ Fahrenheit ↔ Kelvin)
- ✅ Distance (Kilometers ↔ Miles ↔ Feet ↔ Meters)
- ✅ Weight (Kilograms ↔ Pounds ↔ Ounces)
- ✅ Volume (Liters ↔ Gallons ↔ Cups)
- ✅ Time (Hours ↔ Minutes ↔ Seconds)
- ✅ Image Converter (UI demo - needs backend)
- ✅ PDF to Word (placeholder - needs backend)

### Features
- 🏠 Beautiful homepage with converter gallery
- 🔍 Search functionality (UI ready)
- 📱 Responsive navigation
- 💰 AdSense placeholder components
- 🎨 Dark mode support (CSS variables ready)
- 📊 SEO metadata on all pages

## 📖 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup and customization guide
- **[FRAMEWORK_RECOMMENDATIONS.md](./FRAMEWORK_RECOMMENDATIONS.md)** - Technology stack details
- **[AWS_COST_REVENUE_ANALYSIS.md](./AWS_COST_REVENUE_ANALYSIS.md)** - Cost and revenue projections

## ➕ Adding New Converters

### Step 1: Add to Registry
Edit `lib/converters/registry.ts`:

```typescript
{
  id: "your-converter",
  title: "Your Converter",
  description: "Description here",
  category: "temperature",
  icon: Thermometer,
  href: "/convert/your-converter",
  keywords: ["keyword1", "keyword2"],
  popular: true,
}
```

### Step 2: Create Page
Create `app/convert/your-converter/page.tsx`:

```typescript
import { FormulaConverter } from "@/components/converters/formula-converter"
import { convertTemperature } from "@/lib/converters/formula-converters"

const units = [
  { value: "unit1", label: "Unit 1", abbreviation: "u1" },
  { value: "unit2", label: "Unit 2", abbreviation: "u2" },
]

export default function YourConverterPage() {
  return (
    <FormulaConverter
      title="Your Converter"
      description="Convert between unit1 and unit2"
      units={units}
      defaultFromUnit="unit1"
      defaultToUnit="unit2"
      onConvert={convertTemperature}
    />
  )
}
```

**That's it!** The converter automatically appears on the homepage.

## 🎨 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Formula Parsing**: Math.js
- **Icons**: Lucide React

## 🚢 Deployment

### Current setup (prod)
- Frontend: Amplify hosting → `https://toolsworx.com`.
- Backend: Cloud Run container at `https://unified-service-905466639122.us-east5.run.app`.
- Frontend ↔ Backend config: set `NEXT_PUBLIC_CONVERTER_API_URL=https://unified-service-905466639122.us-east5.run.app` in App Hosting/Amplify envs.

### Key backend env vars
- `PORT=3010`
- `CORS_ORIGIN=https://toolsworx.com,https://www.toolsworx.com`
- `TURNSTILE_SECRET_KEY=` (Cloudflare Turnstile secret; enables verification)
- `API_KEYS=` (empty = 3 conversions/24h anon; add comma-separated keys to allow privileged use)
- Limits: `CONVERSION_LIMIT_NOAUTH=3`, `CONVERSION_WINDOW_HOURS=24`, `GLOBAL_RATE_MAX=200`
- Sizes: `MAX_FILE_SIZE=524288000`, `MAX_MEDIA_SIZE=838860800`, `MAX_AUDIO_SIZE=209715200`
- Binaries: `LIBRE_OFFICE_PATH=/usr/bin/libreoffice`, `FFMPEG_PATH=/usr/bin/ffmpeg`
- Misc: `TEMP_DIR=/tmp/uploads`, `LOG_LEVEL=info`, `NODE_ENV=production`

### Deployment helpers
- Backend Docker build/push: see `backend/unified-service/README.md`.

## 💰 Monetization

### Google AdSense Setup
1. Get approved by Google AdSense
2. Edit `config/site.ts`:
   ```typescript
   adsense: {
     client: "ca-pub-XXXXXXXXXXXXXXXX",
     enabled: true,
   }
   ```
3. Update ad slot IDs in `components/ads/ad-unit.tsx`

### Revenue Potential
Based on analysis in `AWS_COST_REVENUE_ANALYSIS.md`:
- **10K visitors/month**: ~$200 profit (80% margin)
- **50K visitors/month**: ~$1,000 profit (82% margin)
- **200K visitors/month**: ~$4,000 profit (80% margin)
- **1M visitors/month**: ~$27,000 profit (85% margin)

## 📊 Project Structure

```
convert-all/
├── app/                    # Next.js pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── convert/           # Converter pages
├── components/
│   ├── layout/            # Header, Footer
│   ├── ads/               # AdSense components
│   ├── converters/        # Reusable converter components
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── converters/
│   │   ├── registry.ts    # Converter registry
│   │   └── formula-converters.ts
│   └── utils.ts
├── config/
│   └── site.ts            # Site config & AdSense
└── types/
    └── converter.ts       # TypeScript types
```

## 🔧 Configuration

### Site Settings
Edit `config/site.ts`:
- App name (replace `[APP_NAME]`)
- Domain URL
- AdSense client ID
- Social media links

### Styling
Edit `app/globals.css` to customize colors and theme.

## 📈 SEO Strategy

Each converter page is optimized for search engines:
- ✅ Unique title and meta description
- ✅ Keyword-rich content
- ✅ Semantic HTML structure
- ✅ Fast loading times
- ✅ Mobile responsive
- ✅ Open Graph tags

Target: Rank for "[conversion type] converter" keywords

## 🤝 Contributing

1. Add converter to registry
2. Create page using `FormulaConverter` template
3. Add SEO content
4. Test locally
5. Deploy

## 📄 License

Open source - Free for personal or commercial use.

## 🆘 Support

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for:
- Detailed setup instructions
- Troubleshooting
- Backend implementation guides
- Advanced customization

## 🎯 Roadmap

- [x] Core formula converters (temperature, distance, weight)
- [x] Modern responsive UI
- [x] AdSense integration
- [x] SEO optimization
- [ ] Search functionality (backend)
- [ ] Image converter (backend with Sharp)
- [ ] PDF to Word (backend with LibreOffice)
- [ ] Video converter (backend with FFmpeg)
- [ ] User accounts (optional)
- [ ] API access (premium feature)

---

**Built with ❤️ using Next.js 16 and React**

Ready to launch in minutes! 🚀 
