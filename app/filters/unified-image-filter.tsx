"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileDropzone } from "@/components/shared/file-dropzone"
import { Image, Download, RotateCcw } from "lucide-react"

const FILTERS = [
  { value: "grayscale", label: "Grayscale" },
  { value: "sepia", label: "Sepia" },
  { value: "vintage", label: "Vintage" },
  { value: "brightness", label: "Brightness" },
  { value: "contrast", label: "Contrast" },
  { value: "saturation", label: "Saturation" },
  { value: "inverse", label: "Inverse" },
  { value: "nashville", label: "Nashville (Instagram)" },
  { value: "valencia", label: "Valencia (Instagram)" },
  { value: "xpro2", label: "X-Pro II (Instagram)" },
]

export function UnifiedImageFilter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [filteredImage, setFilteredImage] = useState<string | null>(null)
  const [filterType, setFilterType] = useState("grayscale")
  const [intensity, setIntensity] = useState([50])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const originalCanvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      setOriginalImage(imageUrl)
      setFilteredImage(null)
      loadImageToCanvas(imageUrl)
    }
    reader.readAsDataURL(file)
  }

  const loadImageToCanvas = (imageUrl: string) => {
    const img = document.createElement('img')
    img.onload = () => {
      const canvas = originalCanvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
    }
    img.src = imageUrl
  }

  const applyFilter = () => {
    const originalCanvas = originalCanvasRef.current
    const canvas = canvasRef.current
    if (!originalCanvas || !canvas) return

    const originalCtx = originalCanvas.getContext('2d')
    const ctx = canvas.getContext('2d')
    if (!originalCtx || !ctx) return

    canvas.width = originalCanvas.width
    canvas.height = originalCanvas.height

    const imageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height)
    const data = imageData.data
    const intensityValue = intensity[0] / 100

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      switch (filterType) {
        case 'grayscale':
          const gray = r * 0.299 + g * 0.587 + b * 0.114
          data[i] = gray * intensityValue + r * (1 - intensityValue)
          data[i + 1] = gray * intensityValue + g * (1 - intensityValue)
          data[i + 2] = gray * intensityValue + b * (1 - intensityValue)
          break
        case 'sepia':
          const sepiaR = (r * 0.393) + (g * 0.769) + (b * 0.189)
          const sepiaG = (r * 0.349) + (g * 0.686) + (b * 0.168)
          const sepiaB = (r * 0.272) + (g * 0.534) + (b * 0.131)
          data[i] = Math.min(255, sepiaR * intensityValue + r * (1 - intensityValue))
          data[i + 1] = Math.min(255, sepiaG * intensityValue + g * (1 - intensityValue))
          data[i + 2] = Math.min(255, sepiaB * intensityValue + b * (1 - intensityValue))
          break
        case 'brightness':
          const brightnessFactor = (intensityValue - 0.5) * 100
          data[i] = Math.max(0, Math.min(255, r + brightnessFactor))
          data[i + 1] = Math.max(0, Math.min(255, g + brightnessFactor))
          data[i + 2] = Math.max(0, Math.min(255, b + brightnessFactor))
          break
        case 'contrast':
          const contrastFactor = intensityValue * 2
          data[i] = Math.max(0, Math.min(255, (r - 128) * contrastFactor + 128))
          data[i + 1] = Math.max(0, Math.min(255, (g - 128) * contrastFactor + 128))
          data[i + 2] = Math.max(0, Math.min(255, (b - 128) * contrastFactor + 128))
          break
        case 'vintage':
          const vintageR = r * 0.9 + g * 0.1
          const vintageG = r * 0.2 + g * 0.8 + b * 0.1
          const vintageB = r * 0.1 + g * 0.1 + b * 0.7
          data[i] = Math.min(255, vintageR * intensityValue + r * (1 - intensityValue))
          data[i + 1] = Math.min(255, vintageG * intensityValue + g * (1 - intensityValue))
          data[i + 2] = Math.min(255, vintageB * intensityValue + b * (1 - intensityValue))
          break
        case 'inverse':
          data[i] = 255 - r
          data[i + 1] = 255 - g
          data[i + 2] = 255 - b
          break
        case 'saturation':
          const saturationFactor = intensityValue * 2
          const grayVal = r * 0.299 + g * 0.587 + b * 0.114
          data[i] = Math.max(0, Math.min(255, grayVal + (r - grayVal) * saturationFactor))
          data[i + 1] = Math.max(0, Math.min(255, grayVal + (g - grayVal) * saturationFactor))
          data[i + 2] = Math.max(0, Math.min(255, grayVal + (b - grayVal) * saturationFactor))
          break
        case 'nashville':
          data[i] = Math.min(255, r * 1.2 + 20)
          data[i + 1] = Math.min(255, g * 1.1 + 10)
          data[i + 2] = Math.max(0, b * 0.9 - 10)
          break
        case 'valencia':
          data[i] = Math.min(255, r * 1.08 + 8)
          data[i + 1] = Math.min(255, g * 1.08 + 8)
          data[i + 2] = Math.max(0, b * 0.95)
          break
        case 'xpro2':
          data[i] = Math.min(255, (r - 128) * 1.3 + 128)
          data[i + 1] = Math.min(255, (g - 128) * 1.3 + 128)
          data[i + 2] = Math.min(255, (b - 128) * 1.3 + 128)
          break
      }
    }

    ctx.putImageData(imageData, 0, 0)
    setFilteredImage(canvas.toDataURL())
  }

  const downloadImage = () => {
    if (!filteredImage) return
    const link = document.createElement('a')
    link.download = `${filterType}-${selectedFile?.name || 'image.png'}`
    link.href = filteredImage
    link.click()
  }

  const resetImage = () => {
    setFilteredImage(null)
    setIntensity([50])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Image Effects & Filters
        </CardTitle>
        <CardDescription>Apply professional filters and effects to your images</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!selectedFile ? (
          <FileDropzone
            onFileSelect={handleFileSelect}
            accept="image/*"
            maxSize={10}
            className="min-h-[200px]"
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Original</Label>
                <div className="border rounded-lg overflow-hidden">
                  {originalImage && (
                    <img src={originalImage} alt="Original" className="w-full h-auto max-h-64 object-contain" />
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Filtered</Label>
                <div className="border rounded-lg overflow-hidden bg-muted">
                  {filteredImage ? (
                    <img src={filteredImage} alt="Filtered" className="w-full h-auto max-h-64 object-contain" />
                  ) : (
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                      Select filter and apply
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Filter Type</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FILTERS.map(filter => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {filterType !== 'inverse' && (
                <div className="space-y-2">
                  <Label>Intensity: {intensity[0]}%</Label>
                  <Slider
                    value={intensity}
                    onValueChange={setIntensity}
                    max={100}
                    min={0}
                    step={1}
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={applyFilter} className="flex-1">
                  Apply Filter
                </Button>
                <Button onClick={resetImage} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                {filteredImage && (
                  <Button onClick={downloadImage} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            </div>

            <Button 
              variant="ghost" 
              onClick={() => {
                setSelectedFile(null)
                setOriginalImage(null)
                setFilteredImage(null)
                setIntensity([50])
              }}
              className="w-full"
            >
              Choose Different Image
            </Button>
          </>
        )}

        <canvas ref={originalCanvasRef} style={{ display: 'none' }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </CardContent>
    </Card>
  )
}
