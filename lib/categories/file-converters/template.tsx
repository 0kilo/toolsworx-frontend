"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { FileDropzone } from "@/components/shared/file-dropzone"
import { Download, Loader2, AlertCircle } from "lucide-react"
import { useRateLimit, RATE_LIMITS } from "@/lib/rate-limit"
import { RateLimitWarning, RateLimitExceeded } from "@/components/ui/rate-limit"

/**
 * FILE CONVERTER TEMPLATE
 *
 * Use this template for file conversions (PDF, Word, Excel, etc.)
 * Includes rate limiting to prevent abuse.
 *
 * Examples:
 * - PDF to Word
 * - Word to PDF
 * - Excel to CSV
 * - Markdown to HTML
 */

// ========================================
// TYPES
// ========================================

export interface FileConverterTemplateProps {
  title: string
  description: string
  acceptedFormats: string[] // e.g., [".pdf", ".docx"]
  outputFormats: { value: string; label: string }[] // e.g., [{value: "docx", label: "Word (.docx)"}]
  maxFileSize: number // in MB
  onConvert: (file: File, outputFormat: string) => Promise<ConversionResult>
  infoContent?: React.ReactNode
  rateLimitConfig?: typeof RATE_LIMITS.FILE_CONVERSION // Use custom rate limit or default
}

export interface ConversionResult {
  success: boolean
  downloadUrl?: string
  fileName?: string
  error?: string
}

export type ConversionStatus = "idle" | "uploading" | "converting" | "complete" | "error"

// ========================================
// COMPONENT
// ========================================

export function FileConverterTemplate({
  title,
  description,
  acceptedFormats,
  outputFormats,
  maxFileSize,
  onConvert,
  infoContent,
  rateLimitConfig = RATE_LIMITS.FILE_CONVERSION,
}: FileConverterTemplateProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [outputFormat, setOutputFormat] = useState(outputFormats[0]?.value || "")
  const [status, setStatus] = useState<ConversionStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Rate limiting
  const rateLimit = useRateLimit(rateLimitConfig)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setResult(null)
    setError(null)
    setStatus("idle")
  }

  const handleConvert = async () => {
    if (!selectedFile) return

    // Check rate limit
    const rateLimitCheck = rateLimit.check()
    if (!rateLimitCheck.allowed) {
      setError(rateLimitCheck.message || "Rate limit exceeded")
      setStatus("error")
      return
    }

    setStatus("uploading")
    setProgress(10)
    setError(null)

    try {
      // Simulate upload progress
      setProgress(30)

      setStatus("converting")
      setProgress(50)

      // Call conversion function
      const conversionResult = await onConvert(selectedFile, outputFormat)

      setProgress(90)

      if (conversionResult.success) {
        setResult(conversionResult)
        setStatus("complete")
        setProgress(100)

        // Record successful operation for rate limiting
        rateLimit.record()
      } else {
        setError(conversionResult.error || "Conversion failed")
        setStatus("error")
      }
    } catch (err: any) {
      console.error("Conversion error:", err)
      setError(err.message || "An unexpected error occurred")
      setStatus("error")
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setOutputFormat(outputFormats[0]?.value || "")
    setStatus("idle")
    setProgress(0)
    setResult(null)
    setError(null)
  }

  const handleDownload = () => {
    if (result?.downloadUrl) {
      window.open(result.downloadUrl, "_blank")
    }
  }

  // Check if limit is exceeded
  if (rateLimit.remaining === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <RateLimitExceeded
          config={rateLimitConfig}
          resetTime={rateLimit.resetTime}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {/* Rate Limit Warning */}
      <RateLimitWarning config={rateLimitConfig} />

      {/* Usage Info */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <AlertCircle className="h-4 w-4" />
        <p>
          {rateLimit.remaining} conversions remaining today
          (Resets at {rateLimit.resetTime.toLocaleTimeString()})
        </p>
      </div>

      {/* Converter Card */}
      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
          <CardDescription>
            Select a file and choose output format
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
          <FileDropzone
            onFileSelect={handleFileSelect}
            accept={acceptedFormats.join(",")}
            maxSize={maxFileSize}
          />

          {/* Output Format Selection */}
          {selectedFile && status === "idle" && (
            <div className="space-y-2">
              <Label htmlFor="output-format">Output Format</Label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {outputFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Convert Button */}
          {selectedFile && status === "idle" && (
            <Button
              onClick={handleConvert}
              className="w-full"
              size="lg"
              disabled={!outputFormat}
            >
              Convert File
            </Button>
          )}

          {/* Progress */}
          {(status === "uploading" || status === "converting") && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>
                  {status === "uploading" && "Uploading..."}
                  {status === "converting" && "Converting..."}
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            </div>
          )}

          {/* Success Result */}
          {status === "complete" && result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center space-y-4">
              <div>
                <p className="text-sm text-green-600 mb-2">
                  Conversion Complete!
                </p>
                <p className="text-lg font-medium text-green-900">
                  {result.fileName || "Your file is ready"}
                </p>
              </div>
              <Button size="lg" className="w-full" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download Converted File
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleReset}
              >
                Convert Another File
              </Button>
            </div>
          )}

          {/* Error */}
          {status === "error" && error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center space-y-4">
              <div>
                <p className="text-sm text-red-600 mb-2">Conversion Failed</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleReset}>
                Try Again
              </Button>
            </div>
          )}

          {/* File Info */}
          {selectedFile && status === "idle" && (
            <div className="text-xs text-muted-foreground">
              <p>
                Accepted formats: {acceptedFormats.join(", ")}
              </p>
              <p>Maximum file size: {maxFileSize}MB</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Info/SEO Content */}
      {infoContent && (
        <Card>
          <CardContent className="pt-6">{infoContent}</CardContent>
        </Card>
      )}

      {/* Important Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900">
            <strong>Privacy:</strong> Your files are automatically deleted after 1 hour.
            We never store or share your data.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// ========================================
// EXAMPLE USAGE
// ========================================

/**
 * Example: PDF to Word Converter
 *
 * import { FileConverterTemplate } from "@/components/templates/file-converter-template"
 *
 * export default function PdfToWordPage() {
 *   const handleConvert = async (file: File, outputFormat: string) => {
 *     // 1. Upload file to S3
 *     const uploadUrl = await uploadToS3(file)
 *
 *     // 2. Trigger Lambda conversion
 *     const response = await fetch("/api/convert/pdf-to-word", {
 *       method: "POST",
 *       body: JSON.stringify({ uploadUrl, outputFormat }),
 *     })
 *
 *     const result = await response.json()
 *
 *     if (result.success) {
 *       return {
 *         success: true,
 *         downloadUrl: result.downloadUrl,
 *         fileName: result.fileName,
 *       }
 *     }
 *
 *     return {
 *       success: false,
 *       error: result.error,
 *     }
 *   }
 *
 *   return (
 *     <FileConverterTemplate
 *       title="PDF to Word Converter"
 *       description="Convert PDF files to Word documents (DOCX)"
 *       acceptedFormats={[".pdf"]}
 *       outputFormats={[
 *         { value: "docx", label: "Word (.docx)" },
 *         { value: "doc", label: "Word 97-2003 (.doc)" },
 *       ]}
 *       maxFileSize={50}
 *       onConvert={handleConvert}
 *     />
 *   )
 * }
 */
