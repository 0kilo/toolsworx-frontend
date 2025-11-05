# Templates Guide

This guide explains how to use the converter templates and theme system to quickly build new converters.

## Table of Contents

1. [Theme Configuration](#theme-configuration)
2. [Calculator Template](#calculator-template)
3. [File Converter Template](#file-converter-template)
4. [Media Converter Template](#media-converter-template)
5. [Measurement Conversion Template](#measurement-conversion-template)
6. [Rate Limiting](#rate-limiting)
7. [Best Practices](#best-practices)

---

## Theme Configuration

All styling is centralized in `/config/theme.ts`. This makes it easy to change the entire app's appearance.

### Usage Example

```typescript
import { theme } from "@/config/theme"

// Use in components
<div className={theme.cardStyles.base}>
  <button className={theme.buttonStyles.variants.default}>
    Click Me
  </button>
</div>

// Or import specific parts
import { colors, buttonStyles } from "@/config/theme"
```

### Customizing the Theme

To change colors across the entire app:

```typescript
// In config/theme.ts
export const colors = {
  primary: {
    DEFAULT: "hsl(221.2 83.2% 53.3%)", // Change this to your brand color
    foreground: "hsl(210 40% 98%)",
    hover: "hsl(221.2 83.2% 45%)",
  },
  // ... other colors
}
```

All components using `theme.colors.primary` will automatically update.

---

## Calculator Template

Use this template for calculators like BMI, mortgage, tip calculators, age calculators, etc.

### Location
`/components/templates/calculator-template.tsx`

### Complete Example: BMI Calculator

**1. Create the page: `/app/calculate/bmi/page.tsx`**

```typescript
"use client"

import { Metadata } from "next"
import { CalculatorTemplate, CalculatorField, CalculatorResult } from "@/components/templates/calculator-template"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { Scale } from "lucide-react"

// Note: Metadata must be exported from parent Server Component in production
// For now, we'll handle it client-side

const fields: CalculatorField[] = [
  {
    name: "weight",
    label: "Weight",
    type: "number",
    placeholder: "Enter weight",
    required: true,
    min: 20,
    max: 500,
    helpText: "Enter your weight in kg or lbs",
  },
  {
    name: "weightUnit",
    label: "Weight Unit",
    type: "select",
    options: [
      { value: "kg", label: "Kilograms (kg)" },
      { value: "lbs", label: "Pounds (lbs)" },
    ],
    required: true,
  },
  {
    name: "height",
    label: "Height",
    type: "number",
    placeholder: "Enter height",
    required: true,
    min: 50,
    max: 300,
    helpText: "Enter your height in cm or inches",
  },
  {
    name: "heightUnit",
    label: "Height Unit",
    type: "select",
    options: [
      { value: "cm", label: "Centimeters (cm)" },
      { value: "in", label: "Inches (in)" },
    ],
    required: true,
  },
]

function calculateBMI(values: Record<string, string>): CalculatorResult[] {
  let weight = parseFloat(values.weight)
  let height = parseFloat(values.height)

  // Convert to metric
  if (values.weightUnit === "lbs") {
    weight = weight * 0.453592
  }
  if (values.heightUnit === "in") {
    height = height * 2.54
  }

  // Calculate BMI
  const heightInMeters = height / 100
  const bmi = weight / (heightInMeters * heightInMeters)

  // Determine category
  let category = ""
  let advice = ""
  if (bmi < 18.5) {
    category = "Underweight"
    advice = "Consider consulting a healthcare provider for guidance"
  } else if (bmi < 25) {
    category = "Normal weight"
    advice = "Maintain your healthy lifestyle"
  } else if (bmi < 30) {
    category = "Overweight"
    advice = "Consider a balanced diet and regular exercise"
  } else {
    category = "Obese"
    advice = "Consult a healthcare provider for personalized advice"
  }

  return [
    {
      label: "Your BMI",
      value: bmi.toFixed(1),
      format: "number",
      highlight: true,
    },
    {
      label: "Category",
      value: category,
      format: "text",
    },
    {
      label: "Advice",
      value: advice,
      format: "text",
      helpText: "This is general advice. Consult a healthcare professional for personalized guidance.",
    },
  ]
}

const infoContent = (
  <div className="prose prose-sm max-w-none">
    <h2>About BMI Calculator</h2>
    <p>
      Body Mass Index (BMI) is a measure of body fat based on height and weight. It's widely
      used as a screening tool to identify potential weight problems.
    </p>
    <h3>BMI Categories</h3>
    <ul>
      <li><strong>Underweight:</strong> BMI less than 18.5</li>
      <li><strong>Normal weight:</strong> BMI 18.5-24.9</li>
      <li><strong>Overweight:</strong> BMI 25-29.9</li>
      <li><strong>Obese:</strong> BMI 30 or greater</li>
    </ul>
    <h3>Important Notes</h3>
    <p>
      BMI is a screening tool, not a diagnostic tool. It doesn't account for muscle mass,
      bone density, or body composition. Athletes and bodybuilders may have high BMI due to
      muscle mass, not excess fat.
    </p>
  </div>
)

export default function BMICalculatorPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CalculatorTemplate
            title="BMI Calculator"
            description="Calculate your Body Mass Index and understand your weight category"
            icon={Scale}
            fields={fields}
            onCalculate={calculateBMI}
            resultTitle="Your Results"
            infoContent={infoContent}
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

**2. Add to registry: `/lib/converters/registry.ts`**

```typescript
import { Scale } from "lucide-react"

{
  id: "bmi-calculator",
  title: "BMI Calculator",
  description: "Calculate your Body Mass Index",
  category: "calculator",
  icon: Scale,
  href: "/calculate/bmi",
  keywords: ["bmi", "body mass index", "weight", "health"],
  popular: true,
}
```

### Another Example: Mortgage Calculator

```typescript
const fields: CalculatorField[] = [
  {
    name: "loanAmount",
    label: "Loan Amount",
    type: "number",
    placeholder: "Enter loan amount",
    required: true,
    min: 10000,
    helpText: "Total amount you want to borrow",
  },
  {
    name: "interestRate",
    label: "Annual Interest Rate (%)",
    type: "number",
    placeholder: "Enter interest rate",
    required: true,
    min: 0,
    max: 30,
    helpText: "Annual interest rate as percentage",
  },
  {
    name: "loanTerm",
    label: "Loan Term (years)",
    type: "number",
    placeholder: "Enter loan term",
    required: true,
    min: 1,
    max: 40,
  },
]

function calculateMortgage(values: Record<string, string>): CalculatorResult[] {
  const principal = parseFloat(values.loanAmount)
  const annualRate = parseFloat(values.interestRate) / 100
  const years = parseFloat(values.loanTerm)

  const monthlyRate = annualRate / 12
  const numberOfPayments = years * 12

  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

  const totalPayment = monthlyPayment * numberOfPayments
  const totalInterest = totalPayment - principal

  return [
    {
      label: "Monthly Payment",
      value: monthlyPayment,
      format: "currency",
      highlight: true,
    },
    {
      label: "Total Payment",
      value: totalPayment,
      format: "currency",
    },
    {
      label: "Total Interest",
      value: totalInterest,
      format: "currency",
    },
  ]
}
```

---

## File Converter Template

Use this template for document conversions (PDF to Word, Excel to CSV, etc.).

### Location
`/components/templates/file-converter-template.tsx`

### Complete Example: PDF to Word Converter

**1. Create the API route: `/app/api/convert/pdf-to-word/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const outputFormat = formData.get("outputFormat") as string

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      )
    }

    // TODO: Implement actual conversion logic
    // For now, we'll simulate it

    // In production, you would:
    // 1. Upload file to S3 or temp storage
    // 2. Use a conversion service (e.g., CloudConvert API, LibreOffice)
    // 3. Generate download URL
    // 4. Return result

    // Simulated conversion
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return NextResponse.json({
      success: true,
      downloadUrl: "/api/download/converted-file.docx",
      fileName: file.name.replace(".pdf", ".docx"),
      originalSize: file.size,
      convertedSize: file.size * 0.8, // Simulated
    })
  } catch (error: any) {
    console.error("Conversion error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
```

**2. Create the page: `/app/convert/pdf-to-word/page.tsx`**

```typescript
"use client"

import { FileConverterTemplate, ConversionResult } from "@/components/templates/file-converter-template"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { RATE_LIMITS } from "@/lib/rate-limit"

const outputFormats = [
  { value: "docx", label: "Word Document (.docx)" },
  { value: "doc", label: "Word 97-2003 (.doc)" },
  { value: "rtf", label: "Rich Text Format (.rtf)" },
]

async function convertPdfToWord(
  file: File,
  outputFormat: string
): Promise<ConversionResult> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("outputFormat", outputFormat)

  const response = await fetch("/api/convert/pdf-to-word", {
    method: "POST",
    body: formData,
  })

  const result = await response.json()
  return result
}

const infoContent = (
  <div className="prose prose-sm max-w-none">
    <h2>About PDF to Word Conversion</h2>
    <p>
      Convert your PDF documents to editable Word format quickly and easily. Our converter
      preserves formatting, images, and layout as much as possible.
    </p>
    <h3>Supported Features</h3>
    <ul>
      <li>Text formatting (bold, italic, underline)</li>
      <li>Images and graphics</li>
      <li>Tables and lists</li>
      <li>Headers and footers</li>
    </ul>
    <h3>Tips for Best Results</h3>
    <ul>
      <li>Use high-quality PDF files for better conversion</li>
      <li>Scanned PDFs may require OCR (not included)</li>
      <li>Complex layouts may need manual adjustment</li>
    </ul>
  </div>
)

export default function PdfToWordPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <FileConverterTemplate
            title="PDF to Word Converter"
            description="Convert PDF documents to editable Word format"
            acceptedFormats={[".pdf"]}
            outputFormats={outputFormats}
            maxFileSize={10}
            onConvert={convertPdfToWord}
            infoContent={infoContent}
            rateLimitConfig={RATE_LIMITS.FILE_CONVERSION}
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

**3. Add to registry**

```typescript
import { FileText } from "lucide-react"

{
  id: "pdf-to-word",
  title: "PDF to Word",
  description: "Convert PDF to editable Word document",
  category: "file",
  icon: FileText,
  href: "/convert/pdf-to-word",
  keywords: ["pdf", "word", "docx", "document"],
  popular: true,
}
```

---

## Media Converter Template

Use this template for image, video, and audio conversions.

### Location
`/components/templates/media-converter-template.tsx`

### Complete Example: Image Format Converter

**1. Create the API route: `/app/api/convert/image/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server"
import sharp from "sharp" // Install: npm install sharp

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const outputFormat = formData.get("outputFormat") as string
    const quality = parseInt(formData.get("quality") as string) || 90
    const width = formData.get("width") ? parseInt(formData.get("width") as string) : undefined
    const height = formData.get("height") ? parseInt(formData.get("height") as string) : undefined

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Process image with sharp
    let image = sharp(buffer)

    // Resize if dimensions provided
    if (width || height) {
      image = image.resize(width, height, {
        fit: "inside",
        withoutEnlargement: true,
      })
    }

    // Convert to output format
    let outputBuffer: Buffer
    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "")

    switch (outputFormat) {
      case "jpg":
      case "jpeg":
        outputBuffer = await image.jpeg({ quality }).toBuffer()
        break
      case "png":
        outputBuffer = await image.png({ quality }).toBuffer()
        break
      case "webp":
        outputBuffer = await image.webp({ quality }).toBuffer()
        break
      default:
        outputBuffer = await image.toBuffer()
    }

    // In production, upload to S3 and return URL
    // For now, convert to base64
    const base64 = outputBuffer.toString("base64")
    const mimeType = `image/${outputFormat}`
    const downloadUrl = `data:${mimeType};base64,${base64}`

    return NextResponse.json({
      success: true,
      downloadUrl,
      fileName: `${fileNameWithoutExt}.${outputFormat}`,
      originalSize: buffer.length,
      convertedSize: outputBuffer.length,
    })
  } catch (error: any) {
    console.error("Image conversion error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
```

**2. Create the page: `/app/convert/image-format/page.tsx`**

```typescript
"use client"

import { MediaConverterTemplate, ConversionResult, MediaConverterOptions } from "@/components/templates/media-converter-template"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { RATE_LIMITS } from "@/lib/rate-limit"

const outputFormats = [
  { value: "jpg", label: "JPEG (.jpg)" },
  { value: "png", label: "PNG (.png)" },
  { value: "webp", label: "WebP (.webp)" },
  { value: "gif", label: "GIF (.gif)" },
]

async function convertImage(
  file: File,
  outputFormat: string,
  options?: MediaConverterOptions
): Promise<ConversionResult> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("outputFormat", outputFormat)
  if (options?.quality) formData.append("quality", options.quality.toString())
  if (options?.width) formData.append("width", options.width.toString())
  if (options?.height) formData.append("height", options.height.toString())

  const response = await fetch("/api/convert/image", {
    method: "POST",
    body: formData,
  })

  const result = await response.json()
  return result
}

const infoContent = (
  <div className="prose prose-sm max-w-none">
    <h2>About Image Format Conversion</h2>
    <p>
      Convert images between different formats easily. Choose quality settings and resize
      options for optimal results.
    </p>
    <h3>Supported Formats</h3>
    <ul>
      <li><strong>JPEG:</strong> Best for photos, smaller file size</li>
      <li><strong>PNG:</strong> Lossless, supports transparency</li>
      <li><strong>WebP:</strong> Modern format, excellent compression</li>
      <li><strong>GIF:</strong> Supports animation</li>
    </ul>
    <h3>Quality Settings</h3>
    <ul>
      <li><strong>90-100%:</strong> Highest quality, larger file size</li>
      <li><strong>70-89%:</strong> Good balance of quality and size</li>
      <li><strong>Below 70%:</strong> Smaller files, visible quality loss</li>
    </ul>
  </div>
)

export default function ImageFormatConverterPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <MediaConverterTemplate
            title="Image Format Converter"
            description="Convert images between JPG, PNG, WebP, and more"
            mediaType="image"
            acceptedFormats={[".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"]}
            outputFormats={outputFormats}
            maxFileSize={10}
            showOptions={true}
            onConvert={convertImage}
            infoContent={infoContent}
            rateLimitConfig={RATE_LIMITS.IMAGE_CONVERSION}
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

---

## Measurement Conversion Template

This already exists as `FormulaConverter` in `/components/converters/formula-converter.tsx`.

### Usage Example

See existing converters like:
- `/app/convert/celsius-fahrenheit/page.tsx`
- `/app/convert/km-miles/page.tsx`
- `/app/convert/kg-lbs/page.tsx`

```typescript
import { FormulaConverter } from "@/components/converters/formula-converter"

<FormulaConverter
  title="Temperature Converter"
  description="Convert between Celsius, Fahrenheit, and Kelvin"
  units={temperatureUnits}
  defaultFromUnit="celsius"
  defaultToUnit="fahrenheit"
  conversionType="temperature"
  placeholder="Enter temperature"
  resultLabel="Converted Temperature"
/>
```

---

## Rate Limiting

Rate limiting prevents abuse of resource-intensive operations.

### Location
`/lib/rate-limit.ts`

### Client-Side Usage (in Components)

```typescript
import { useRateLimit, RATE_LIMITS, RateLimitWarning, RateLimitExceeded } from "@/lib/rate-limit"

export default function MyConverterPage() {
  const rateLimit = useRateLimit(RATE_LIMITS.VIDEO_CONVERSION)

  const handleConvert = async () => {
    // Check rate limit
    const check = rateLimit.check()
    if (!check.allowed) {
      alert(check.message)
      return
    }

    // Perform conversion
    const result = await convertVideo(...)

    // Record successful operation
    if (result.success) {
      rateLimit.record()
    }
  }

  // Show warning when approaching limit
  if (rateLimit.remaining === 0) {
    return <RateLimitExceeded config={RATE_LIMITS.VIDEO_CONVERSION} resetTime={rateLimit.resetTime} />
  }

  return (
    <div>
      <RateLimitWarning config={RATE_LIMITS.VIDEO_CONVERSION} />
      {/* Your converter UI */}
      <p>{rateLimit.remaining} conversions remaining</p>
    </div>
  )
}
```

### Server-Side Usage (in API Routes)

```typescript
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  // Get user identifier (IP address)
  const identifier = request.headers.get("x-forwarded-for") || "unknown"

  // Check rate limit
  const rateLimitCheck = checkRateLimit(RATE_LIMITS.VIDEO_CONVERSION, identifier)

  if (!rateLimitCheck.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: rateLimitCheck.message,
        resetTime: rateLimitCheck.resetTime,
      },
      { status: 429 }
    )
  }

  // Proceed with conversion
  try {
    const result = await performConversion(...)
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
```

### Available Rate Limit Configurations

```typescript
RATE_LIMITS.FILE_CONVERSION      // 10 per day
RATE_LIMITS.VIDEO_CONVERSION     // 5 per day
RATE_LIMITS.IMAGE_CONVERSION     // 20 per day
RATE_LIMITS.AUDIO_CONVERSION     // 15 per day
RATE_LIMITS.HEAVY_CALCULATION    // 50 per day
```

### Custom Rate Limits

```typescript
import { useRateLimit } from "@/lib/rate-limit"

const customLimit = {
  maxRequests: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "You've reached your hourly limit",
}

const rateLimit = useRateLimit(customLimit)
```

---

## Best Practices

### 1. SEO Optimization

Add proper metadata to every converter page:

```typescript
export const metadata: Metadata = {
  title: "BMI Calculator - Free Online Tool",
  description: "Calculate your Body Mass Index instantly with our free online BMI calculator",
  keywords: ["bmi calculator", "body mass index", "health calculator"],
  openGraph: {
    title: "BMI Calculator",
    description: "Calculate your BMI instantly",
    type: "website",
  },
}
```

### 2. Error Handling

Always handle errors gracefully:

```typescript
try {
  const result = await convertFile(...)
  if (!result.success) {
    setError(result.error || "Conversion failed")
  }
} catch (error: any) {
  console.error("Conversion error:", error)
  setError("An unexpected error occurred. Please try again.")
}
```

### 3. Input Validation

Validate user inputs before processing:

```typescript
const fields: CalculatorField[] = [
  {
    name: "age",
    label: "Age",
    type: "number",
    required: true,
    min: 1,
    max: 120,
    helpText: "Enter your age in years",
  },
]
```

### 4. File Size Limits

Always set reasonable file size limits:

```typescript
<FileConverterTemplate
  maxFileSize={10} // 10 MB for documents
  // ...
/>

<MediaConverterTemplate
  maxFileSize={50} // 50 MB for videos
  // ...
/>
```

### 5. Progressive Enhancement

Show progress for long operations:

```typescript
setStatus("uploading")
setProgress(10)

// Upload file
setProgress(30)

// Convert
setStatus("converting")
setProgress(50)

// Complete
setStatus("complete")
setProgress(100)
```

### 6. Privacy

Always include privacy notices:

```typescript
<Card className="bg-blue-50 border-blue-200">
  <CardContent className="pt-6">
    <p className="text-sm text-blue-900">
      <strong>Privacy:</strong> Your files are processed securely and automatically
      deleted after 1 hour. We never store or share your files.
    </p>
  </CardContent>
</Card>
```

### 7. Ad Placement

Follow AdSense best practices:

```typescript
<div className="container py-8">
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
    <div className="lg:col-span-3">
      {/* Main content */}
      <YourConverter />
      <FooterAd /> {/* Below the fold */}
    </div>
    <div className="lg:col-span-1">
      <SidebarAd /> {/* Sidebar on desktop */}
    </div>
  </div>
</div>
```

### 8. Mobile Responsiveness

All templates are mobile-responsive by default. Test on different screen sizes:

```bash
# Tailwind responsive classes used
sm:  // 640px
md:  // 768px
lg:  // 1024px
xl:  // 1280px
```

---

## Quick Start Checklist

When creating a new converter:

- [ ] Choose the appropriate template
- [ ] Create the page in `/app/convert/[name]/page.tsx` or `/app/calculate/[name]/page.tsx`
- [ ] Implement the conversion/calculation logic
- [ ] Add rate limiting for resource-intensive operations
- [ ] Create API route if needed (for file/media conversions)
- [ ] Add proper metadata for SEO
- [ ] Include info content for better SEO
- [ ] Add converter to registry in `/lib/converters/registry.ts`
- [ ] Test on mobile and desktop
- [ ] Verify ad placements
- [ ] Test rate limiting
- [ ] Deploy and monitor

---

## Support

For questions or issues:
1. Check existing converter implementations in `/app/convert/` and `/app/calculate/`
2. Review the template source code
3. Test with the provided examples
4. Refer to Next.js 14 documentation for advanced features

Happy building! 🚀
