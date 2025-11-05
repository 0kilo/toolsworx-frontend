"use client"

import { useState } from "react"
import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { FileDropzone } from "@/components/shared/file-dropzone"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { Download, Loader2 } from "lucide-react"

export default function ImageConverterPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [outputFormat, setOutputFormat] = useState("png")
  const [converting, setConverting] = useState(false)
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setConvertedUrl(null)
  }

  const handleConvert = async () => {
    if (!selectedFile) return

    setConverting(true)

    // TODO: Implement actual conversion
    // For now, this is a placeholder that demonstrates the UI flow
    // You would typically:
    // 1. Upload file to S3
    // 2. Call Lambda/API to convert
    // 3. Poll for completion
    // 4. Get download URL

    // Simulated conversion
    setTimeout(() => {
      setConvertedUrl("https://example.com/converted-file." + outputFormat)
      setConverting(false)
    }, 2000)
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Image Format Converter</h1>
            <p className="text-muted-foreground">
              Convert images between JPG, PNG, WEBP, GIF, and other formats
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>
                Select an image to convert to a different format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FileDropzone
                onFileSelect={handleFileSelect}
                accept="image/*"
                maxSize={50}
              />

              {selectedFile && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="output-format">Output Format</Label>
                    <Select
                      id="output-format"
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value)}
                    >
                      <option value="png">PNG</option>
                      <option value="jpg">JPG</option>
                      <option value="webp">WEBP</option>
                      <option value="gif">GIF</option>
                      <option value="bmp">BMP</option>
                    </Select>
                  </div>

                  <Button
                    onClick={handleConvert}
                    disabled={converting}
                    className="w-full"
                    size="lg"
                  >
                    {converting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      "Convert Image"
                    )}
                  </Button>
                </>
              )}

              {convertedUrl && (
                <div className="bg-primary/10 border border-primary rounded-lg p-6 text-center space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Conversion Complete!
                    </p>
                    <p className="text-lg font-medium">
                      Your image has been converted to {outputFormat.toUpperCase()}
                    </p>
                  </div>
                  <Button size="lg" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Converted Image
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Note: This is a demo. Implement actual conversion logic in production.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <FooterAd />

          {/* SEO Content */}
          <div className="mt-8 prose prose-sm max-w-none">
            <h2>About Image Format Conversion</h2>
            <p>
              Converting between image formats is useful for web optimization, compatibility,
              and reducing file sizes. This tool supports all major image formats.
            </p>

            <h3>Supported Formats</h3>
            <ul>
              <li><strong>PNG:</strong> Lossless compression, supports transparency</li>
              <li><strong>JPG:</strong> Best for photographs, smaller file size</li>
              <li><strong>WEBP:</strong> Modern format, excellent compression</li>
              <li><strong>GIF:</strong> Supports animation, limited colors</li>
              <li><strong>BMP:</strong> Uncompressed, large file size</li>
            </ul>

            <h3>When to Use Each Format</h3>
            <ul>
              <li><strong>Use PNG</strong> for logos, graphics with transparency, screenshots</li>
              <li><strong>Use JPG</strong> for photographs, images without transparency</li>
              <li><strong>Use WEBP</strong> for web optimization, modern browsers</li>
              <li><strong>Use GIF</strong> for simple animations, small graphics</li>
            </ul>

            <h3>Implementation Note</h3>
            <p>
              This is a UI demonstration. To implement actual image conversion:
            </p>
            <ol>
              <li>Install Sharp or Jimp for image processing</li>
              <li>Create an API route to handle file uploads</li>
              <li>Process the image server-side or use AWS Lambda</li>
              <li>Return the converted file for download</li>
            </ol>
          </div>
        </div>

        <div className="lg:col-span-1">
          <SidebarAd />
        </div>
      </div>
    </div>
  )
}
