"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { AboutDescription } from "@/components/ui/about-description"
import { Link, Copy, Check } from "lucide-react"
import { encodeURL, decodeURL } from "@/lib/tools/logic/dev-tools/tool-url"
import toolContent from "./url-encoder.json"

export default function UrlencoderClient() {
  const [input, setInput] = useState("")
  const [encoded, setEncoded] = useState("")
  const [decoded, setDecoded] = useState("")
  const [copied, setCopied] = useState("")

  const handleEncode = () => {
    try {
      const result = encodeURL({ text: input })
      setEncoded(result.encoded)
    } catch (error) {
      setEncoded("Error encoding")
    }
  }

  const handleDecode = () => {
    try {
      const result = decodeURL({ text: input })
      setDecoded(result.decoded)
    } catch (error) {
      setDecoded("Error decoding")
    }
  }

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(""), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{toolContent.pageTitle}</h1>
            <p className="text-muted-foreground">
              {toolContent.pageDescription}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                URL Encoding Tool
              </CardTitle>
              <CardDescription>
                Convert special characters for URL compatibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="input">Input Text/URL</Label>
                <Textarea
                  id="input"
                  placeholder="Enter text or URL to encode/decode"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleEncode} className="flex-1">
                  Encode
                </Button>
                <Button onClick={handleDecode} variant="outline" className="flex-1">
                  Decode
                </Button>
              </div>

              {encoded && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Encoded Result</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(encoded, "encoded")}
                    >
                      {copied === "encoded" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Textarea value={encoded} readOnly rows={3} />
                </div>
              )}

              {decoded && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Decoded Result</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(decoded, "decoded")}
                    >
                      {copied === "decoded" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Textarea value={decoded} readOnly rows={3} />
                </div>
              )}
            </CardContent>
          </Card>


          <AboutDescription
            title={toolContent.aboutTitle}
            description={toolContent.aboutDescription}
            sections={toolContent.sections as any}
          />
        </div>

        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}