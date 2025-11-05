# Required Libraries for File and Media Conversion

This document outlines the libraries and tools needed to implement file and media conversion features.

## Overview

**YES, you need special libraries for file and media conversion!** These conversions cannot be done with JavaScript alone and require specialized libraries or external services.

---

## 📄 File Conversion (Documents)

### PDF Operations

#### **pdf-lib** (Recommended for basic PDF operations)
```bash
npm install pdf-lib
```
**Use cases:**
- Create PDFs from scratch
- Modify existing PDFs
- Extract pages
- Merge PDFs
- Add images/text to PDFs

**Limitations:**
- Cannot convert PDF to Word/Excel (need external service)
- Cannot OCR scanned PDFs

#### **pdfjs-dist** (PDF.js by Mozilla)
```bash
npm install pdfjs-dist
```
**Use cases:**
- Render PDF in browser
- Extract text from PDFs
- Get PDF metadata

#### **PDF to Word/Excel Conversion**
**Options:**
1. **CloudConvert API** (Recommended)
   - Pay-per-use service
   - Supports PDF → Word, Excel, PowerPoint
   - High quality conversions
   - https://cloudconvert.com/api/v2

2. **Gotenberg** (Self-hosted, FREE)
   ```bash
   docker run --rm -p 3000:3000 gotenberg/gotenberg:7
   ```
   - LibreOffice-based conversions
   - Can run on AWS with Docker
   - Supports Office ↔ PDF conversions

3. **Zamzar API** (Commercial)
   - Similar to CloudConvert
   - https://developers.zamzar.com/

### Word/Excel Operations

#### **mammoth** (Word to HTML)
```bash
npm install mammoth
```
**Use cases:**
- Convert .docx to HTML
- Extract text from Word documents
- Preserve formatting

**Limitations:**
- Only reads .docx (not .doc)
- Cannot create Word files

#### **docx** (Create Word documents)
```bash
npm install docx
```
**Use cases:**
- Create .docx files from scratch
- Add text, tables, images
- Generate reports

#### **xlsx** (Excel operations)
```bash
npm install xlsx
```
**Use cases:**
- Read Excel files (.xls, .xlsx, .csv)
- Create Excel files
- Convert Excel ↔ CSV, JSON
- Modify spreadsheets

**Example:**
```typescript
import * as XLSX from 'xlsx'

// Read Excel
const workbook = XLSX.readFile('input.xlsx')
const sheet = workbook.Sheets[workbook.SheetNames[0]]
const data = XLSX.utils.sheet_to_json(sheet)

// Create Excel
const ws = XLSX.utils.json_to_sheet(data)
const wb = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(wb, ws, "Sheet1")
XLSX.writeFile(wb, "output.xlsx")
```

---

## 🖼️ Image Conversion

### **sharp** (Recommended - FAST & POWERFUL)
```bash
npm install sharp
```

**Use cases:**
- Convert: JPG, PNG, WebP, AVIF, TIFF, GIF, SVG
- Resize images
- Compress images
- Rotate, flip, blur
- Change quality
- Add watermarks

**Example:**
```typescript
import sharp from 'sharp'

// Convert PNG to JPG with quality 80%
await sharp('input.png')
  .jpeg({ quality: 80 })
  .toFile('output.jpg')

// Resize and convert
await sharp('input.png')
  .resize(800, 600)
  .webp({ quality: 90 })
  .toFile('output.webp')
```

**Performance:**
- 4-5x faster than other Node.js image libraries
- Uses libvips (C library) under the hood
- Perfect for server-side use

**Limitations:**
- Requires Node.js server (cannot run in browser)
- No animation support for GIFs

### **browser-image-compression** (Client-side)
```bash
npm install browser-image-compression
```

**Use cases:**
- Compress images in browser before upload
- Reduce file size without server

**When to use:**
- Client-side compression before upload
- Combined with sharp on server for conversions

---

## 🎥 Video Conversion

### **FFmpeg** (ESSENTIAL for video/audio)

FFmpeg is the industry-standard tool for video/audio processing.

#### Installation Options:

**1. Docker (Recommended for AWS)**
```bash
docker run --rm -v $(pwd):/work jrottenberg/ffmpeg:latest \
  -i /work/input.mp4 -c:v libx264 /work/output.mp4
```

**2. AWS Lambda Layer**
- Use pre-built FFmpeg Lambda layer
- https://github.com/serverlesspub/ffmpeg-aws-lambda-layer

**3. EC2/Server Installation**
```bash
sudo apt-get install ffmpeg  # Ubuntu
brew install ffmpeg          # macOS
```

#### Node.js Wrapper: **fluent-ffmpeg**
```bash
npm install fluent-ffmpeg @ffmpeg-installer/ffmpeg
```

**Example:**
```typescript
import ffmpeg from 'fluent-ffmpeg'

// Convert MP4 to WebM
ffmpeg('input.mp4')
  .output('output.webm')
  .videoCodec('libvpx')
  .audioCodec('libvorbis')
  .on('progress', (progress) => {
    console.log(`Processing: ${progress.percent}% done`)
  })
  .on('end', () => {
    console.log('Conversion finished')
  })
  .run()

// Extract audio from video
ffmpeg('video.mp4')
  .output('audio.mp3')
  .noVideo()
  .run()

// Change resolution
ffmpeg('input.mp4')
  .size('1280x720')
  .output('output.mp4')
  .run()

// Create thumbnail
ffmpeg('video.mp4')
  .screenshots({
    timestamps: ['00:00:03'],
    filename: 'thumbnail.png',
    size: '320x240'
  })
```

**Capabilities:**
- Video format conversion (MP4, WebM, AVI, MOV, etc.)
- Audio extraction
- Video compression
- Resolution change
- Frame rate adjustment
- Add watermarks
- Trim/cut videos
- Merge videos
- Generate thumbnails

**Limitations:**
- Large file sizes
- CPU/time intensive
- Need server or serverless function (Lambda)
- Cannot run in browser

---

## 🎵 Audio Conversion

### **FFmpeg** (Same as video)
Best option for audio conversions:
- MP3, WAV, AAC, OGG, FLAC, M4A

```typescript
// Convert WAV to MP3
ffmpeg('input.wav')
  .audioCodec('libmp3lame')
  .audioBitrate('192k')
  .output('output.mp3')
  .run()

// Change bitrate
ffmpeg('input.mp3')
  .audioBitrate('128k')
  .output('output.mp3')
  .run()
```

### **lamejs** (Client-side MP3 encoding)
```bash
npm install lamejs
```

**Use cases:**
- Convert WAV to MP3 in browser
- Real-time audio encoding

**Limitations:**
- Only WAV → MP3
- Slower than FFmpeg
- Limited format support

---

## 🏗️ Architecture Recommendations

### Option 1: Server-Side (Traditional)

**Pros:**
- Full control
- All libraries available
- No file size limits

**Cons:**
- Need to manage servers
- Higher costs for high traffic

**Stack:**
```
Next.js API Routes → Sharp/FFmpeg → S3 Storage
```

### Option 2: Serverless (AWS Lambda)

**Pros:**
- Pay per use
- Scales automatically
- Lower cost for variable traffic

**Cons:**
- 10 GB max file size
- 15 minute timeout
- Cold start delays

**Stack:**
```
Next.js → API Gateway → Lambda (with FFmpeg layer) → S3
```

**Example Lambda Function:**
```typescript
// lambda/convert-video.ts
import { S3 } from '@aws-sdk/client-s3'
import ffmpeg from 'fluent-ffmpeg'
import { promisify } from 'util'
import fs from 'fs'

export const handler = async (event) => {
  const { inputKey, outputFormat } = JSON.parse(event.body)

  // Download from S3
  const s3 = new S3()
  const inputFile = await s3.getObject({
    Bucket: 'my-bucket',
    Key: inputKey
  })

  // Convert with FFmpeg
  await new Promise((resolve, reject) => {
    ffmpeg('/tmp/input.mp4')
      .output(`/tmp/output.${outputFormat}`)
      .on('end', resolve)
      .on('error', reject)
      .run()
  })

  // Upload to S3
  const outputFile = fs.readFileSync(`/tmp/output.${outputFormat}`)
  await s3.putObject({
    Bucket: 'my-bucket',
    Key: `converted/${outputKey}`,
    Body: outputFile
  })

  return {
    statusCode: 200,
    body: JSON.stringify({ downloadUrl: `...` })
  }
}
```

### Option 3: External Service API

**Pros:**
- No infrastructure management
- High quality conversions
- Handles all formats

**Cons:**
- Ongoing costs per conversion
- Dependent on third party
- Data leaves your servers

**Recommended Services:**
1. **CloudConvert** - Most comprehensive
2. **Zamzar** - Good for documents
3. **Transloadit** - Good for media

---

## 💰 Cost Estimates

### If Using AWS Lambda + FFmpeg:

**10,000 monthly visitors, 2 conversions/visitor:**
- 20,000 conversions/month
- Avg 30 seconds per video conversion
- Lambda cost: ~$50-100/month
- S3 storage: ~$5/month
- **Total: ~$55-105/month**

### If Using CloudConvert API:

**Pricing:**
- $9/month for 2,000 conversion minutes
- Additional $4.50 per 1,000 minutes

**20,000 conversions, avg 30 seconds:**
- 10,000 minutes total
- Cost: $9 + (8 × $4.50) = $45/month

### If Using Self-Hosted EC2:

**t3.medium instance (recommended for conversions):**
- $30-35/month
- Can handle moderate traffic
- Full control

---

## 📦 Recommended Package.json Additions

```json
{
  "dependencies": {
    // Image conversion
    "sharp": "^0.33.0",

    // Document operations
    "pdf-lib": "^1.17.1",
    "mammoth": "^1.6.0",
    "docx": "^8.5.0",
    "xlsx": "^0.18.5",

    // Video/Audio (only if server-side)
    "fluent-ffmpeg": "^2.1.2",
    "@ffmpeg-installer/ffmpeg": "^1.1.0",

    // AWS SDK (if using S3/Lambda)
    "@aws-sdk/client-s3": "^3.400.0",
    "@aws-sdk/s3-request-presigner": "^3.400.0"
  }
}
```

---

## 🚀 Quick Start Guide

### 1. Start with Images (Easiest)

```bash
npm install sharp
```

Create API route: `app/api/convert/image/route.ts`

```typescript
import sharp from 'sharp'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  const outputFormat = formData.get('outputFormat') as string

  const buffer = Buffer.from(await file.arrayBuffer())

  let convertedBuffer
  if (outputFormat === 'jpg') {
    convertedBuffer = await sharp(buffer).jpeg({ quality: 90 }).toBuffer()
  } else if (outputFormat === 'png') {
    convertedBuffer = await sharp(buffer).png().toBuffer()
  } else if (outputFormat === 'webp') {
    convertedBuffer = await sharp(buffer).webp({ quality: 90 }).toBuffer()
  }

  return new NextResponse(convertedBuffer, {
    headers: {
      'Content-Type': `image/${outputFormat}`,
      'Content-Disposition': `attachment; filename=converted.${outputFormat}`
    }
  })
}
```

### 2. Add Documents

```bash
npm install pdf-lib xlsx
```

For PDF → Word, use CloudConvert API or Gotenberg.

### 3. Add Video/Audio (Advanced)

Set up Lambda with FFmpeg layer or use CloudConvert API.

---

## ⚠️ Important Considerations

### File Size Limits

- **API Routes (Next.js):** Default 4 MB limit
  ```javascript
  // next.config.js
  module.exports = {
    api: {
      bodyParser: {
        sizeLimit: '50mb',
      },
    },
  }
  ```

- **Lambda:** 10 GB max with EFS, 250 MB without
- **Browser uploads:** Recommended max 100 MB

### Processing Time

- **Images:** 1-5 seconds
- **Documents:** 5-30 seconds
- **Videos:** 30 seconds - 5 minutes

**Recommendation:** Use background jobs for videos > 1 minute.

### Storage

- **Temporary files:** Use `/tmp` in Lambda
- **Permanent storage:** S3 or similar
- **Auto-delete:** Set lifecycle policies to delete after 24 hours

---

## 🎯 Summary

| Conversion Type | Library | Complexity | Server Required |
|----------------|---------|------------|-----------------|
| Image formats | sharp | Easy | Yes |
| PDF operations | pdf-lib | Easy | No (can run in browser) |
| PDF to Word | CloudConvert API | Medium | Yes |
| Excel/CSV | xlsx | Easy | No |
| Word to HTML | mammoth | Easy | No |
| Video/Audio | FFmpeg | Hard | Yes |

**Recommendation for MVP:**
1. Start with **image conversion** (sharp) - easiest
2. Add **Excel/CSV** (xlsx) - easy & useful
3. Use **CloudConvert API** for PDF/Word - saves development time
4. Add **video conversion** last - most complex

**Best Architecture:**
- Images: Next.js API routes with sharp
- Documents: CloudConvert API or Gotenberg in Docker
- Videos: AWS Lambda with FFmpeg or CloudConvert API

Let me know if you'd like detailed implementation examples for any specific conversion type!
