"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AboutDescription } from "@/components/ui/about-description"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy, Check, ArrowRight, ArrowLeft } from "lucide-react"

export default function Base64EncoderPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const encode = () => {
    setError("")
    if (!input) {
      setError("Please enter text to encode")
      return
    }
    try {
      const encoded = Buffer.from(input, 'utf-8').toString('base64')
      setOutput(encoded)
    } catch (e: any) {
      setError(`Encoding error: ${e.message}`)
    }
  }

  const decode = () => {
    setError("")
    if (!input) {
      setError("Please enter Base64 to decode")
      return
    }
    try {
      const decoded = Buffer.from(input, 'base64').toString('utf-8')
      setOutput(decoded)
    } catch (e: any) {
      setError(`Decoding error: ${e.message}`)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleSwap = () => {
    const temp = input
    setInput(output)
    setOutput(temp)
    setError("")
  }

  const handleClear = () => {
    setInput("")
    setOutput("")
    setError("")
  }

  return (
    <div className="container py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Base64 Encoder/Decoder</h1>
        <p className="text-xl text-muted-foreground">
          Encode and decode Base64 strings instantly
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Enter text or Base64</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to encode or Base64 to decode"
              className="font-mono text-sm min-h-[300px]"
            />
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={encode} className="w-full">
                <ArrowRight className="h-4 w-4 mr-2" />
                Encode
              </Button>
              <Button onClick={decode} variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Decode
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={handleSwap} variant="outline" className="w-full">
                Swap
              </Button>
              <Button onClick={handleClear} variant="outline" className="w-full">
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Output
              {output && (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </CardTitle>
            <CardDescription>Result</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
                {error}
              </div>
            )}
            {output && (
              <Textarea value={output} readOnly className="font-mono text-sm min-h-[300px]" />
            )}
            {!output && !error && (
              <div className="flex items-center justify-center min-h-[300px] text-muted-foreground border-2 border-dashed rounded-lg">
                Result will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AboutDescription
        title="About Base64 Encoding"
        description="Base64 is a binary-to-text encoding scheme that represents binary data in ASCII format. It's commonly used to encode data in emails, URLs, and data URIs."
        sections={[
          {
            title: "Use Cases",
            content: [
              "Encoding binary data for transmission over text-based protocols",
              "Embedding images in HTML/CSS using data URIs",
              "Encoding authentication credentials",
              "Encoding data in JSON or XML where binary data isn't allowed"
            ]
          }
        ]}
      />
    </div>
  )
}
