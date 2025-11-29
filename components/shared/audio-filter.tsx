"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { FileDropzone } from "./file-dropzone"
import { Download, Music, Loader2 } from "lucide-react"

interface AudioFilterProps {
  title: string
  description: string
  filterType: string
  controls?: React.ReactNode
  getOptions?: () => any
}

export function AudioFilter({ title, description, filterType, controls, getOptions }: AudioFilterProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedAudio, setProcessedAudio] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setProcessedAudio(null)
    setError(null)
  }

  const processAudio = async (options: any = {}) => {
    if (!selectedFile) return

    setIsProcessing(true)
    setError(null)

    try {
      // Import amplify client
      const { amplifyApiClient } = await import('@/lib/services/amplify-client')
      
      // Call Amplify audio filter function
      const result = await amplifyApiClient.applyAudioFilter(selectedFile, filterType, options)
      setProcessedAudio(result.downloadUrl)
    } catch (err: any) {
      setError(err.message || 'Processing failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadAudio = () => {
    if (!processedAudio) return

    const link = document.createElement('a')
    link.href = processedAudio
    link.download = `filtered_${selectedFile?.name || 'audio'}`
    link.click()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileDropzone
            onFileSelect={handleFileSelect}
            accept="audio/*"
            maxSize={50}
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8"
          />

          {selectedFile && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Music className="h-4 w-4" />
                <span className="text-sm font-medium">{selectedFile.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                </span>
              </div>

              {controls}

              <Button 
                onClick={() => processAudio(getOptions ? getOptions() : {})} 
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing Audio...
                  </>
                ) : (
                  `Apply ${filterType} Filter`
                )}
              </Button>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          {processedAudio && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium mb-2">Audio processed successfully!</p>
                <audio controls className="w-full">
                  <source src={processedAudio} />
                  Your browser does not support the audio element.
                </audio>
              </div>

              <Button onClick={downloadAudio} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Filtered Audio
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}