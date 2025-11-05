"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FileDropzone } from "@/components/converters/file-dropzone"
import { Download, Loader2, AlertCircle } from "lucide-react"
import { useRateLimit, RATE_LIMITS, RateLimitWarning, RateLimitExceeded } from "@/lib/rate-limit"

/**
 * MEDIA CONVERTER TEMPLATE
 *
 * Use this template for media conversions (images, videos, audio)
 * Includes rate limiting and quality/size options.
 *
 * Examples:
 * - JPG to PNG
 * - MP4 to GIF
 * - MP3 to WAV
 * - Image resize
 * - Video compression
 */

// ========================================
// TYPES
// ========================================

export type MediaType = "image" | "video" | "audio"

export interface MediaConverterOptions {
  // Image options
  width?: number
  height?: number
  quality?: number
  maintainAspectRatio?: boolean

  // Video options
  videoBitrate?: string
  audioBitrate?: string
  fps?: number
  resolution?: string

  // Audio options
  sampleRate?: number
  channels?: number
}

export interface MediaConverterTemplateProps {
  title: string
  description: string
  mediaType: MediaType
  acceptedFormats: string[]
  outputFormats: { value: string; label: string }[]
  maxFileSize: number
  showOptions?: boolean // Show quality/size options
  onConvert: (
    file: File,
    outputFormat: string,
    options?: MediaConverterOptions
  ) => Promise<ConversionResult>
  infoContent?: React.ReactNode
  rateLimitConfig?: typeof RATE_LIMITS.IMAGE_CONVERSION
}

export interface ConversionResult {
  success: boolean
  downloadUrl?: string
  fileName?: string
  originalSize?: number
  convertedSize?: number
  error?: string
}

export type ConversionStatus = "idle" | "uploading" | "converting" | "complete" | "error"

// ========================================
// COMPONENT
// ========================================

export function MediaConverterTemplate({
  title,
  description,
  mediaType,
  acceptedFormats,
  outputFormats,
  maxFileSize,
  showOptions = true,
  onConvert,
  infoContent,
  rateLimitConfig = RATE_LIMITS.IMAGE_CONVERSION,
}: MediaConverterTemplateProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [outputFormat, setOutputFormat] = useState(outputFormats[0]?.value || "")
  const [options, setOptions] = useState<MediaConverterOptions>({
    quality: 90,
    maintainAspectRatio: true,
  })
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

    // Create preview for images
    if (mediaType === "image") {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
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
      setProgress(30)
      setStatus("converting")
      setProgress(50)

      // Call conversion function
      const conversionResult = await onConvert(selectedFile, outputFormat, options)

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
    setPreviewUrl(null)
    setOutputFormat(outputFormats[0]?.value || "")
    setOptions({
      quality: 90,
      maintainAspectRatio: true,
    })
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
          <CardTitle>Upload {mediaType === "image" ? "Image" : mediaType === "video" ? "Video" : "Audio"}</CardTitle>
          <CardDescription>
            Select a file and configure conversion settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
          <FileDropzone
            onFileSelect={handleFileSelect}
            accept={acceptedFormats.join(",")}
            maxSize={maxFileSize}
          />

          {/* Preview (for images) */}
          {previewUrl && mediaType === "image" && status === "idle" && (
            <div className="border rounded-lg p-4 bg-muted/50">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full max-h-64 mx-auto rounded"
              />
            </div>
          )}

          {/* Settings */}
          {selectedFile && status === "idle" && (
            <div className="space-y-4">
              {/* Output Format */}
              <div className="space-y-2">
                <Label htmlFor="output-format">Output Format</Label>
                <Select
                  id="output-format"
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                >
                  {outputFormats.map((format) => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Options (if enabled) */}
              {showOptions && (
                <>
                  {/* Image Options */}
                  {mediaType === "image" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="width">Width (px)</Label>
                        <Input
                          id="width"
                          type="number"
                          placeholder="Auto"
                          value={options.width || ""}
                          onChange={(e) =>
                            setOptions({
                              ...options,
                              width: e.target.value ? parseInt(e.target.value) : undefined,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (px)</Label>
                        <Input
                          id="height"
                          type="number"
                          placeholder="Auto"
                          value={options.height || ""}
                          onChange={(e) =>
                            setOptions({
                              ...options,
                              height: e.target.value ? parseInt(e.target.value) : undefined,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quality">Quality (%)</Label>
                        <Input
                          id="quality"
                          type="number"
                          min="1"
                          max="100"
                          value={options.quality || 90}
                          onChange={(e) =>
                            setOptions({
                              ...options,
                              quality: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* Video Options */}
                  {mediaType === "video" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="resolution">Resolution</Label>
                        <Select
                          id="resolution"
                          value={options.resolution || "original"}
                          onChange={(e) =>
                            setOptions({ ...options, resolution: e.target.value })
                          }
                        >
                          <option value="original">Original</option>
                          <option value="1080p">1080p (1920x1080)</option>
                          <option value="720p">720p (1280x720)</option>
                          <option value="480p">480p (854x480)</option>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fps">FPS</Label>
                        <Select
                          id="fps"
                          value={options.fps?.toString() || "original"}
                          onChange={(e) =>
                            setOptions({
                              ...options,
                              fps: e.target.value === "original" ? undefined : parseInt(e.target.value),
                            })
                          }
                        >
                          <option value="original">Original</option>
                          <option value="60">60 FPS</option>
                          <option value="30">30 FPS</option>
                          <option value="24">24 FPS</option>
                        </Select>
                      </div>
                    </div>
                  )}
                </>
              )}
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
              Convert {mediaType === "image" ? "Image" : mediaType === "video" ? "Video" : "Audio"}
            </Button>
          )}

          {/* Progress */}
          {(status === "uploading" || status === "converting") && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>
                  {status === "uploading" && "Uploading..."}
                  {status === "converting" && `Converting ${mediaType}...`}
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
              {mediaType === "video" && (
                <p className="text-xs text-center text-muted-foreground">
                  Video conversion may take a few minutes...
                </p>
              )}
            </div>
          )}

          {/* Success Result */}
          {status === "complete" && result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-green-600 mb-2">
                  Conversion Complete!
                </p>
                <p className="text-lg font-medium text-green-900">
                  {result.fileName || "Your file is ready"}
                </p>
                {result.originalSize && result.convertedSize && (
                  <p className="text-sm text-green-700 mt-2">
                    Size: {(result.originalSize / 1024 / 1024).toFixed(2)}MB →{" "}
                    {(result.convertedSize / 1024 / 1024).toFixed(2)}MB
                    {result.convertedSize < result.originalSize && (
                      <span className="ml-1">
                        (
                        {(
                          ((result.originalSize - result.convertedSize) /
                            result.originalSize) *
                          100
                        ).toFixed(0)}
                        % smaller)
                      </span>
                    )}
                  </p>
                )}
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
              {mediaType === "video" && (
                <p className="text-yellow-600 mt-1">
                  Note: Video conversion can take 2-5 minutes depending on file size
                </p>
              )}
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
            <strong>Privacy:</strong> Your files are processed securely and automatically
            deleted after 1 hour. We never store or share your media.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
