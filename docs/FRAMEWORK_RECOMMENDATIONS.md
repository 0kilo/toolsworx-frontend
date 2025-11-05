# Framework & Technology Stack Recommendations

## Overview
This document outlines the recommended technology stack for building a multi-purpose conversion website with:
- File/media drag-and-drop conversions
- Formula/calculation parsers
- Fast performance for SEO (critical for ad revenue)
- Serverless-friendly architecture

---

## 🏆 Recommended Stack (Modern & Serverless)

### Frontend Framework: **Next.js 14+ (React)**

**Why Next.js:**
- ✅ **Excellent SEO** - Server-side rendering (SSR) for better Google rankings
- ✅ **Fast page loads** - Critical for ad revenue (better Core Web Vitals)
- ✅ **Built-in routing** - Easy to create /pdf-to-word, /celsius-to-fahrenheit URLs
- ✅ **API routes** - Backend logic in same codebase
- ✅ **Easy AWS deployment** - Works perfectly with Amplify or Vercel
- ✅ **Large ecosystem** - Tons of libraries for conversions

**Alternative:** SvelteKit (faster, smaller bundle, but smaller ecosystem)

### UI Component Library: **shadcn/ui + Tailwind CSS**

**Why shadcn/ui:**
- ✅ **Copy-paste components** - Not a dependency, you own the code
- ✅ **Beautiful, modern design** - Professional look out of the box
- ✅ **Accessibility built-in** - Important for SEO and user retention
- ✅ **Tailwind CSS** - Rapid styling, small bundle size
- ✅ **Dark mode ready** - User preference improves engagement

**Alternatives:** Material UI, Chakra UI, Ant Design

### Drag & Drop: **react-dropzone**

```javascript
import { useDropzone } from 'react-dropzone';

function FileUploader() {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    onDrop: files => handleConversion(files)
  });

  return (
    <div {...getRootProps()} className="border-dashed border-2 p-8">
      <input {...getInputProps()} />
      <p>Drag & drop files here, or click to select</p>
    </div>
  );
}
```

**Why react-dropzone:**
- ✅ **Most popular** - 10M+ weekly downloads
- ✅ **File type validation** - Built-in MIME type checking
- ✅ **Size limits** - Prevent abuse
- ✅ **Mobile friendly** - Works on touch devices
- ✅ **Customizable** - Full control over UI

**Alternatives:** react-dnd, uppy (more features, heavier)

---

## Backend & Processing

### API Framework: **Next.js API Routes + AWS Lambda**

**Architecture:**
```
Client Upload → Next.js API Route → S3 Upload → Lambda/Fargate → Process → Return URL
```

**For Light Conversions (< 10s):**
```javascript
// pages/api/convert/temperature.js
export default async function handler(req, res) {
  const { value, from, to } = req.body;

  // Simple formula parsing
  const result = convertTemperature(value, from, to);

  return res.json({ result });
}
```

**For Heavy Conversions (> 10s):**
```javascript
// pages/api/convert/video.js
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

export default async function handler(req, res) {
  // 1. Upload to S3
  const s3Key = await uploadToS3(req.body.file);

  // 2. Trigger async Lambda/Fargate
  await triggerConversion({
    inputKey: s3Key,
    outputFormat: req.body.format,
    callbackUrl: req.body.webhookUrl
  });

  // 3. Return job ID for polling
  return res.json({ jobId: s3Key, status: 'processing' });
}
```

**Why This Approach:**
- ✅ **Serverless** - Aligns with cost analysis
- ✅ **Scalable** - Handles traffic spikes
- ✅ **Simple deployment** - One codebase
- ✅ **Cost efficient** - Pay per use

---

## Formula Parser: **Math.js**

```javascript
import { evaluate, parse, derivative } from 'mathjs';

// Basic calculations
evaluate('sqrt(3^2 + 4^2)'); // 5

// Unit conversions (built-in!)
evaluate('5 inch to cm'); // 12.7 cm
evaluate('100 fahrenheit to celsius'); // 37.777... °C
evaluate('10 kg to lbs'); // 22.046... lbs

// Complex expressions
const scope = { a: 3, b: 4 };
evaluate('a * b', scope); // 12

// Formula validation
try {
  parse('2 + 2'); // Valid
} catch (err) {
  // Invalid formula
}
```

**Why Math.js:**
- ✅ **Comprehensive** - Handles 99% of conversion formulas
- ✅ **Unit conversions built-in** - No need to write custom logic
- ✅ **Safe evaluation** - No eval() security risks
- ✅ **Extensible** - Can add custom functions
- ✅ **Small bundle** - Can tree-shake unused features

**Alternatives:**
- expr-eval (lighter, fewer features)
- algebrite (symbolic math)
- Custom parser (more control, more work)

---

## File/Media Conversion Libraries

### Document Conversions

#### PDF Operations: **pdf-lib** (client-side) + **PDFtk/Ghostscript** (server-side)

```javascript
// Client-side PDF manipulation
import { PDFDocument } from 'pdf-lib';

// Merge PDFs
const pdfDoc = await PDFDocument.create();
const pages = await pdfDoc.copyPages(sourcePdf, [0, 1, 2]);
pages.forEach(page => pdfDoc.addPage(page));
const merged = await pdfDoc.save();

// Server-side (Lambda)
// Use AWS Lambda Layer with Ghostscript
const { spawn } = require('child_process');
spawn('gs', ['-sDEVICE=pdfwrite', '-o', 'output.pdf', 'input.ps']);
```

**Libraries:**
- **pdf-lib**: Client-side PDF creation/editing
- **pdfjs-dist**: PDF rendering in browser
- **LibreOffice** (headless): DOCX ↔ PDF, ODT, etc.
- **Pandoc**: Markdown ↔ DOCX, HTML, PDF

#### Office Documents: **LibreOffice (Headless)**

```bash
# In Lambda/Fargate container
libreoffice --headless --convert-to pdf input.docx --outdir /tmp
libreoffice --headless --convert-to docx input.pdf --outdir /tmp
```

**Docker Layer for Lambda:**
```dockerfile
FROM public.ecr.aws/lambda/nodejs:18
RUN yum install -y libreoffice
```

### Image Conversions: **Sharp** (Node.js) or **Jimp** (Pure JS)

```javascript
// Sharp (fastest, needs native binaries)
import sharp from 'sharp';

await sharp('input.jpg')
  .resize(800, 600)
  .toFormat('webp', { quality: 80 })
  .toFile('output.webp');

// Convert formats
await sharp('input.png').toFormat('jpg').toFile('output.jpg');

// Jimp (pure JavaScript, slower, easier Lambda deployment)
import Jimp from 'jimp';

const image = await Jimp.read('input.png');
await image
  .resize(800, 600)
  .quality(80)
  .writeAsync('output.jpg');
```

**Why Sharp:**
- ✅ **10-20x faster** than Jimp
- ✅ **Better quality**
- ✅ **More formats**
- ⚠️ Needs native binaries (Lambda layer required)

**Why Jimp:**
- ✅ **Pure JavaScript** - Easy Lambda deployment
- ✅ **No dependencies**
- ⚠️ Slower processing

### Video Conversions: **FFmpeg** (via Lambda Layer or Fargate)

```javascript
// In Lambda/Fargate
const ffmpeg = require('fluent-ffmpeg');

ffmpeg('/tmp/input.mov')
  .output('/tmp/output.mp4')
  .videoCodec('libx264')
  .audioCodec('aac')
  .on('end', () => uploadToS3('/tmp/output.mp4'))
  .run();

// Common conversions
// MOV → MP4
// AVI → MP4
// Video → GIF
// Extract audio: MP4 → MP3
```

**Deployment:**
- Use **FFmpeg Lambda Layer** (pre-built available)
- Or use **ECS Fargate** for long videos (>5 min)

### Audio Conversions: **FFmpeg** or **fluent-ffmpeg**

```javascript
// MP3 ↔ WAV ↔ OGG ↔ AAC
ffmpeg('/tmp/input.mp3')
  .toFormat('wav')
  .audioBitrate('128k')
  .save('/tmp/output.wav');
```

---

## Complete Tech Stack Summary

### Frontend
```
Next.js 14+
├── React 18+
├── TypeScript (recommended)
├── Tailwind CSS
├── shadcn/ui components
├── react-dropzone (file uploads)
├── math.js (formula parsing)
├── pdf-lib (client-side PDF)
├── sharp/jimp (client-side image preview)
└── lucide-react (icons)
```

### Backend/Processing
```
AWS Serverless
├── Next.js API Routes (routing)
├── AWS Lambda (processing)
│   ├── Node.js 18+ runtime
│   ├── Layers: FFmpeg, LibreOffice, Ghostscript
│   └── Sharp (with layer)
├── ECS Fargate (heavy conversions)
│   └── Docker with all conversion tools
├── S3 (file storage)
├── DynamoDB (job tracking)
└── SQS (job queue)
```

### Development Tools
```
├── TypeScript
├── ESLint + Prettier
├── Vitest or Jest (testing)
├── Playwright (E2E tests)
└── AWS CDK or Terraform (infrastructure)
```

---

## Recommended Project Structure

```
convert-all/
├── apps/
│   └── web/                    # Next.js app
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx        # Homepage
│       │   ├── pdf-to-word/
│       │   ├── celsius-to-fahrenheit/
│       │   └── api/
│       │       └── convert/
│       │           ├── document/
│       │           ├── image/
│       │           ├── video/
│       │           └── formula/
│       ├── components/
│       │   ├── ui/             # shadcn components
│       │   ├── FileDropzone.tsx
│       │   ├── ConversionForm.tsx
│       │   └── AdUnit.tsx
│       └── lib/
│           ├── conversions/
│           │   ├── temperature.ts
│           │   ├── distance.ts
│           │   └── weight.ts
│           └── aws/
│               ├── s3.ts
│               └── lambda.ts
├── packages/
│   └── conversion-engine/      # Shared conversion logic
│       ├── src/
│       │   ├── document/
│       │   ├── image/
│       │   ├── video/
│       │   └── formula/
│       └── package.json
├── infrastructure/             # AWS CDK
│   ├── lib/
│   │   ├── lambda-stack.ts
│   │   ├── storage-stack.ts
│   │   └── fargate-stack.ts
│   └── bin/
│       └── deploy.ts
└── package.json
```

---

## Conversion Categories & Libraries

### 1. Document Conversions

| From → To | Library | Deployment |
|-----------|---------|------------|
| PDF → DOCX | LibreOffice | Lambda/Fargate |
| DOCX → PDF | LibreOffice | Lambda/Fargate |
| Markdown → HTML | Marked.js | Lambda/Client |
| HTML → PDF | Puppeteer | Lambda/Fargate |
| TXT → PDF | PDFKit | Lambda |
| Excel → CSV | xlsx | Lambda/Client |
| CSV → Excel | xlsx | Lambda/Client |

### 2. Image Conversions

| From → To | Library | Deployment |
|-----------|---------|------------|
| PNG ↔ JPG ↔ WEBP | Sharp/Jimp | Lambda |
| HEIC → JPG | sharp (with plugin) | Lambda |
| SVG → PNG | sharp | Lambda |
| RAW → JPG | sharp | Lambda |
| Resize/Compress | sharp | Lambda/Client |

### 3. Video Conversions

| From → To | Library | Deployment |
|-----------|---------|------------|
| MOV → MP4 | FFmpeg | Fargate |
| AVI → MP4 | FFmpeg | Fargate |
| Video → GIF | FFmpeg | Lambda/Fargate |
| Compress video | FFmpeg | Fargate |
| Extract audio | FFmpeg | Lambda |

### 4. Audio Conversions

| From → To | Library | Deployment |
|-----------|---------|------------|
| MP3 ↔ WAV | FFmpeg | Lambda |
| OGG ↔ AAC | FFmpeg | Lambda |
| M4A → MP3 | FFmpeg | Lambda |
| Compress audio | FFmpeg | Lambda |

### 5. Unit Conversions (Formula-based)

| Category | Library | Implementation |
|----------|---------|----------------|
| Temperature | Math.js | Client-side |
| Distance | Math.js | Client-side |
| Weight | Math.js | Client-side |
| Volume | Math.js | Client-side |
| Speed | Math.js | Client-side |
| Currency | Exchange API | Server-side |
| Time zones | Luxon | Client-side |

---

## Sample Implementation: Temperature Converter

```typescript
// app/celsius-to-fahrenheit/page.tsx
'use client';

import { useState } from 'react';
import { evaluate } from 'mathjs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function TemperatureConverter() {
  const [celsius, setCelsius] = useState('');
  const [fahrenheit, setFahrenheit] = useState('');

  const convert = () => {
    try {
      // Math.js has built-in unit conversion!
      const result = evaluate(`${celsius} celsius to fahrenheit`);
      setFahrenheit(result.toString());
    } catch (err) {
      setFahrenheit('Invalid input');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Celsius to Fahrenheit</h1>

      <div className="max-w-md space-y-4">
        <Input
          type="number"
          placeholder="Enter Celsius"
          value={celsius}
          onChange={(e) => setCelsius(e.target.value)}
        />

        <Button onClick={convert}>Convert</Button>

        {fahrenheit && (
          <div className="text-2xl">
            {celsius}°C = {fahrenheit}°F
          </div>
        )}
      </div>

      {/* Ad units */}
      <div className="mt-8">
        <AdUnit slot="temperature-converter-1" />
      </div>
    </div>
  );
}
```

---

## Sample Implementation: PDF to DOCX

```typescript
// app/api/convert/pdf-to-docx/route.ts
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file || file.type !== 'application/pdf') {
    return Response.json({ error: 'Invalid file' }, { status: 400 });
  }

  // 1. Upload to S3
  const s3Key = `uploads/${Date.now()}-${file.name}`;
  const s3Client = new S3Client({ region: 'us-east-1' });

  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: s3Key,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type
  }));

  // 2. Trigger Lambda for conversion
  const jobId = await triggerConversion({
    inputKey: s3Key,
    outputFormat: 'docx',
    inputFormat: 'pdf'
  });

  // 3. Return job ID for polling
  return Response.json({
    jobId,
    status: 'processing',
    pollUrl: `/api/jobs/${jobId}`
  });
}

// app/api/jobs/[id]/route.ts
export async function GET(req: Request, { params }: { params: { id: string } }) {
  // Check DynamoDB for job status
  const job = await getJobStatus(params.id);

  if (job.status === 'completed') {
    // Generate presigned URL for download
    const downloadUrl = await getSignedUrl(
      new S3Client({}),
      new GetObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: job.outputKey
      }),
      { expiresIn: 3600 }
    );

    return Response.json({
      status: 'completed',
      downloadUrl
    });
  }

  return Response.json({ status: job.status });
}
```

---

## Performance Optimization

### 1. Client-Side Processing (When Possible)
```typescript
// For simple conversions, do them client-side
// - No server costs
// - Instant results
// - Better user experience

// Example: Image resize (small images)
import Compressor from 'compressorjs';

new Compressor(file, {
  quality: 0.8,
  maxWidth: 1920,
  success: (result) => {
    // Download immediately
  }
});
```

**Client-side suitable for:**
- Simple unit conversions
- Small image resizing (<5MB)
- Text format conversions
- PDF merging (small files)

### 2. Progressive Loading
```typescript
// Show conversion progress
const [progress, setProgress] = useState(0);

// Poll job status
const pollJob = async (jobId: string) => {
  const interval = setInterval(async () => {
    const job = await fetch(`/api/jobs/${jobId}`);
    const { status, progress } = await job.json();

    setProgress(progress);

    if (status === 'completed') {
      clearInterval(interval);
    }
  }, 1000);
};
```

### 3. Caching Common Conversions
```typescript
// Cache conversion results
import { Redis } from '@upstash/redis';

const redis = new Redis({ /* config */ });

// Check cache first
const cacheKey = `conversion:${fileHash}:${outputFormat}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return cached; // Instant result!
}

// Process and cache
const result = await convert(file);
await redis.set(cacheKey, result, { ex: 3600 }); // 1 hour TTL
```

---

## SEO Optimization (Critical for Traffic)

### 1. Individual Pages for Each Conversion
```
/pdf-to-word
/celsius-to-fahrenheit
/jpg-to-png
/mp4-to-gif
...etc (100+ pages)
```

### 2. SEO Metadata
```typescript
// app/pdf-to-word/page.tsx
export const metadata = {
  title: 'Free PDF to Word Converter Online | Convert-All',
  description: 'Convert PDF to Word (DOCX) for free. Fast, secure, no registration required. Supports all PDF versions.',
  keywords: 'pdf to word, pdf to docx, convert pdf, free pdf converter',
  openGraph: {
    title: 'PDF to Word Converter',
    description: 'Convert PDF to Word for free',
    images: ['/og-pdf-to-word.png']
  }
};
```

### 3. Structured Data
```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'PDF to Word Converter',
  applicationCategory: 'UtilitiesApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  }
};
```

---

## Deployment Options

### Option 1: Vercel (Easiest)
```bash
npm install -g vercel
vercel deploy

# Pros:
# - Zero config Next.js deployment
# - Automatic HTTPS
# - Edge functions
# - Free tier generous

# Cons:
# - Limited Lambda execution time (10s hobby, 60s pro)
# - Not as cheap at scale as AWS
```

### Option 2: AWS Amplify
```bash
amplify init
amplify add hosting
amplify publish

# Pros:
# - Full AWS integration
# - Custom Lambda timeout
# - Cheaper at scale

# Cons:
# - More complex setup
# - Less automatic optimization
```

### Option 3: Self-hosted on AWS (Most Control)
```bash
# Using AWS CDK
npm install -g aws-cdk
cdk init app --language typescript
cdk deploy

# Deploy to:
# - S3 + CloudFront (static)
# - ECS Fargate (Next.js SSR)
# - Lambda (API)

# Pros:
# - Full control
# - Cheapest at scale
# - Custom timeouts

# Cons:
# - Most complex
# - Manual optimization
```

---

## Recommended MVP Features (Week 1-2)

### Phase 1: Core Conversions
1. **Temperature**: C ↔ F ↔ K (client-side, instant)
2. **Distance**: km ↔ miles ↔ feet (client-side)
3. **PDF to DOCX** (server-side, showcase drag-drop)
4. **Image resize/format** (client-side for <5MB)

### Phase 2: SEO Pages (Week 3-4)
1. Create 20-30 conversion pages
2. Add blog for "how to convert X to Y"
3. Implement structured data
4. Add sitemap

### Phase 3: Advanced (Month 2+)
1. Video conversions (Fargate)
2. Batch conversions
3. API access
4. Premium tier (no ads)

---

## Cost Estimate for Tech Stack

### Development (One-time)
- Next.js: **Free**
- All libraries: **Free** (open source)
- shadcn/ui: **Free**
- AWS account: **Free** (free tier)

### Monthly Costs (10K visitors)
- Vercel Hobby: **$0** (or AWS $49 from analysis)
- Domain: **$12/year** → ~$1/month
- **Total: $1-50/month**

### Time to MVP
- With this stack: **1-2 weeks** (experienced dev)
- Learning curve: **+1 week** (if new to Next.js)

---

## Final Recommendation

**Go with:**
```
Next.js 14 + TypeScript
+ shadcn/ui + Tailwind
+ react-dropzone
+ Math.js (formulas)
+ Sharp (images)
+ LibreOffice (documents)
+ FFmpeg (video/audio)
+ AWS Lambda + S3
```

**Why:**
- ✅ Modern, performant stack
- ✅ Excellent SEO (crucial for traffic)
- ✅ Easy to deploy (Vercel or AWS)
- ✅ Scales with serverless
- ✅ Rich ecosystem
- ✅ Fast development
- ✅ Great user experience

**Start simple:**
1. Build 5-10 conversion tools
2. Deploy to Vercel (free)
3. Add Google AdSense
4. Iterate based on traffic

You can build a working MVP in **1-2 weeks** with this stack!
