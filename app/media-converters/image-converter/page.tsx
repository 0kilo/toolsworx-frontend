"use client"

import { useState } from "react"
import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { FileDropzone } from "@/components/shared/file-dropzone"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"
import { Download, Loader2 } from "lucide-react"
import { ConversionService, ConversionJob } from "@/lib/services"

export default function ImageConverterPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [outputFormat, setOutputFormat] = useState("png")
  const [converting, setConverting] = useState(false)
  const [job, setJob] = useState<ConversionJob | null>(null)
  const [progress, setProgress] = useState(0)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setJob(null)
    setProgress(0)
  }

  const handleConvert = async () => {
    if (!selectedFile) return

    setConverting(true)
    setProgress(0)

    try {
      // Start conversion
      const conversionJob = await ConversionService.convertImageFormat(
        selectedFile,
        outputFormat,
        { quality: 90 }
      )

      setJob(conversionJob)

      // Poll for completion
      const completedJob = await ConversionService.pollJobStatus(
        conversionJob.id,
        (updatedJob) => {
          setProgress(updatedJob.progress || 0)
        }
      )

      setJob(completedJob)
    } catch (error) {
      console.error('Conversion failed:', error)
      alert('Conversion failed. Please try again.')
    } finally {
      setConverting(false)
    }
  }

  const handleDownload = async () => {
    if (!job?.id) return

    try {
      await ConversionService.downloadConvertedFile(
        job.id,
        `converted-image.${outputFormat}`
      )
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again.')
    }
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

              {converting && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-4" />
                  <p className="text-lg font-medium mb-2">Converting Image...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-muted-foreground">{progress}% complete</p>
                </div>
              )}

              {job?.status === 'completed' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Conversion Complete!
                    </p>
                    <p className="text-lg font-medium">
                      Your image has been converted to {outputFormat.toUpperCase()}
                    </p>
                  </div>
                  <Button size="lg" className="w-full" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Converted Image
                  </Button>
                </div>
              )}

              {job?.status === 'failed' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-lg font-medium text-red-800 mb-2">Conversion Failed</p>
                  <p className="text-sm text-red-600">{job.error || 'Unknown error occurred'}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <FooterAd />

          <AboutDescription
            title="About Image Format Conversion"
            description="Converting between image formats is useful for web optimization, compatibility, and reducing file sizes. This tool supports all major image formats."
            sections={[
              {
                title: "Supported Formats",
                content: [
                  "<strong>PNG:</strong> Lossless compression, supports transparency",
                  "<strong>JPG:</strong> Best for photographs, smaller file size",
                  "<strong>WEBP:</strong> Modern format, excellent compression",
                  "<strong>GIF:</strong> Supports animation, limited colors",
                  "<strong>BMP:</strong> Uncompressed, large file size"
                ]
              },
              {
                title: "Usage Guidelines & Implementation",
                type: "subsections",
                content: [
                  {
                    title: "When to Use Each Format",
                    items: [
                      "<strong>Use PNG</strong> for logos, graphics with transparency, screenshots",
                      "<strong>Use JPG</strong> for photographs, images without transparency",
                      "<strong>Use WEBP</strong> for web optimization, modern browsers",
                      "<strong>Use GIF</strong> for simple animations, small graphics"
                    ]
                  },
                  {
                    title: "Implementation Steps",
                    items: [
                      "Install Sharp or Jimp for image processing",
                      "Create an API route to handle file uploads",
                      "Process the image server-side or use AWS Lambda",
                      "Return the converted file for download"
                    ]
                  }
                ]
              }
            ]}
          />
        </div>

        <div className="lg:col-span-1">
          <SidebarAd />
        </div>
      </div>
    </div>
  )
}
