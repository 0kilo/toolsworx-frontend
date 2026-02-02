"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileDropzone } from "@/components/shared/file-dropzone"
import { Turnstile } from "@/components/shared/turnstile"
import { convertFile, StreamConversionResult } from "@/lib/services/api-client"
import { Download, FileText, AlertCircle, ArrowRight } from "lucide-react"

interface ConversionState {
  status: 'idle' | 'processing' | 'completed' | 'error'
  result?: StreamConversionResult
  downloadUrl?: string
  error?: string
}

interface ConversionFormat {
  value: string
  label: string
  accept?: string
  extensions: string[]
}

interface FileConverterProps {
  title: string
  description: string
  fromFormats: ConversionFormat[]
  toFormats: ConversionFormat[]
  defaultFrom?: string
  defaultTo?: string
  maxSize?: number
}

export function FileConverter({
  title,
  description,
  fromFormats,
  toFormats,
  defaultFrom,
  defaultTo,
  maxSize = 50
}: FileConverterProps) {
  const [file, setFile] = useState<File | null>(null)
  const [fromFormat, setFromFormat] = useState(defaultFrom || fromFormats[0]?.value)
  const [toFormat, setToFormat] = useState(defaultTo || toFormats[0]?.value)
  const [conversion, setConversion] = useState<ConversionState>({ status: 'idle' })
  const downloadUrlRef = useRef<string | null>(null)
  const [indicator, setIndicator] = useState(0)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileKey, setTurnstileKey] = useState(0)
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

  const selectedFromFormat = fromFormats.find(f => f.value === fromFormat)
  const selectedToFormat = toFormats.find(f => f.value === toFormat)

  const handleFileSelect = (selectedFile: File) => {
    cleanupDownload()
    setFile(selectedFile)
    setConversion({ status: 'idle' })
    setTurnstileToken('')
    setTurnstileKey((prev) => prev + 1)
  }

  const handleConvert = async () => {
    if (!file || !toFormat) return
    if (turnstileSiteKey && !turnstileToken) {
      setConversion({
        status: 'error',
        error: 'Please complete the verification to continue.'
      })
      return
    }

    try {
      setConversion({ status: 'processing' })
      if (turnstileSiteKey) setTurnstileToken('')
      const result = await convertFile(file, fromFormat, toFormat, { turnstileToken })
      cleanupDownload()
      const downloadUrl = URL.createObjectURL(result.blob)
      downloadUrlRef.current = downloadUrl
      setConversion({
        status: 'completed',
        result,
        downloadUrl,

      })
      if (turnstileSiteKey) setTurnstileKey(prev => prev + 1)
    } catch (error: any) {
      setConversion({
        status: 'error',
        error: error.message || 'Conversion failed'
      })
      if (turnstileSiteKey) setTurnstileKey(prev => prev + 1)
    }
  }

  const handleDownload = () => {
    if (!conversion.result || !selectedToFormat) return
    const url = conversion.downloadUrl || URL.createObjectURL(conversion.result.blob)
    const a = document.createElement('a')
    a.href = url
    const originalName = file?.name?.split('.').slice(0, -1).join('.') || 'converted'
    a.download = `${originalName}.${selectedToFormat.extensions[0]}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    if (!conversion.downloadUrl) {

      URL.revokeObjectURL(url)
    }
  }

  const cleanupDownload = () => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }
  }

  const resetConverter = () => {
    cleanupDownload()
    setFile(null)
    setConversion({ status: 'idle' })
  }

  const acceptedTypes = selectedFromFormat?.accept || 
    selectedFromFormat?.extensions.map(ext => `.${ext}`).join(',') || '*'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {turnstileSiteKey && file && (
          <div className="flex justify-start">
            <Turnstile key={turnstileKey} siteKey={turnstileSiteKey} onToken={setTurnstileToken} />
          </div>
        )}
        {/* Format Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <Select value={fromFormat} onValueChange={setFromFormat}>
            <SelectTrigger>
              <SelectValue placeholder="From format" />
            </SelectTrigger>
            <SelectContent>
              {fromFormats.map(format => (
                <SelectItem key={format.value} value={format.value}>
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex justify-center">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <Select value={toFormat} onValueChange={setToFormat}>
            <SelectTrigger>
              <SelectValue placeholder="To format" />
            </SelectTrigger>
            <SelectContent>
              {toFormats.map(format => (
                <SelectItem key={format.value} value={format.value}>
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* File Upload/Conversion */}
        {!file ? (
          <FileDropzone
            onFileSelect={handleFileSelect}
            accept={acceptedTypes}
            maxSize={maxSize}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={resetConverter}>
                Remove
              </Button>
            </div>

            {conversion.status === 'idle' && (
              <Button
                onClick={handleConvert}
                className="w-full"
                disabled={Boolean(turnstileSiteKey && !turnstileToken)}
              >
                Convert to {selectedToFormat?.label}
              </Button>
            )}

            {conversion.status === 'processing' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Converting...</span>
                  <span>{indicator}%</span>
                </div>
                <Progress value={indicator || 10} />
              </div>
            )}

            {conversion.status === 'completed' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <Download className="h-4 w-4" />
                  <span className="text-sm font-medium">Conversion completed!</span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleDownload} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download {selectedToFormat?.label} File
                  </Button>
                  <Button variant="outline" onClick={resetConverter}>
                    Convert Another
                  </Button>
                </div>
              </div>
            )}

            {conversion.status === 'error' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {conversion.error || 'Conversion failed'}
                  </span>
                </div>
                <Button variant="outline" onClick={resetConverter} className="w-full">
                  Try Again
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
