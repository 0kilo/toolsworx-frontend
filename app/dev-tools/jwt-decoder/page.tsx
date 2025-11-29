"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AboutDescription } from "@/components/ui/about-description"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy, Check, Key, Sparkles } from "lucide-react"

export default function JWTDecoderPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const processInput = () => {
    setError("")
    setOutput("")

    if (!input.trim()) {
      setError("Please enter a JWT token to decode")
      return
    }

    try {
      // Simple JWT decoding without verification (frontend only)
      const parts = input.trim().split('.')
      
      if (parts.length !== 3) {
        setError("Invalid JWT format. JWT should have 3 parts separated by dots.")
        return
      }

      // Decode header and payload (skip signature verification for frontend)
      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')))
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
      
      const decoded = {
        header,
        payload,
        signature: parts[2],
        note: "⚠️ This is decode-only. Signature verification requires server-side validation."
      }

      setOutput(JSON.stringify(decoded, null, 2))
    } catch (e: any) {
      setError(`Decoding failed: ${e.message}`)
    }
  }

  const handleCopy = async () => {
    if (!output) return

    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleClear = () => {
    setInput("")
    setOutput("")
    setError("")
    setCopied(false)
  }

  return (
    <div className="container py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">JWT Decoder</h1>
        <p className="text-xl text-muted-foreground">
          Decode JWT tokens to view header and payload information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              JWT Token
            </CardTitle>
            <CardDescription>Paste your JWT token to decode</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
              className="font-mono text-sm min-h-[400px]"
            />

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={processInput} className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Decode JWT
              </Button>
              <Button onClick={handleClear} variant="outline" className="w-full">
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Decoded JWT
              {output && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto h-8 w-8"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              )}
            </CardTitle>
            <CardDescription>Header, payload, and signature information</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
                {error}
              </div>
            )}
            {output && (
              <Textarea
                value={output}
                readOnly
                className="font-mono text-sm min-h-[400px]"
              />
            )}
            {!output && !error && (
              <div className="flex items-center justify-center min-h-[400px] text-muted-foreground border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Decoded JWT will appear here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AboutDescription
        title="About JWT Decoder"
        description="Decode JSON Web Tokens (JWT) to view header and payload information. This tool decodes tokens client-side for inspection but does not verify signatures. All processing happens in your browser for privacy."
        sections={[
          {
            title: "Features",
            content: [
              "Decode JWT header and payload",
              "View token expiration and claims",
              "Copy decoded JSON with one click",
              "100% client-side processing for privacy",
              "No signature verification (decode only)"
            ]
          },
          {
            title: "How to Use",
            content: [
              "Paste your JWT token in the input field",
              "Click 'Decode JWT' to extract information",
              "Review the header, payload, and signature",
              "Copy the decoded JSON for further analysis"
            ]
          },
          {
            title: "JWT Structure",
            content: [
              "<strong>Header:</strong> Contains algorithm and token type",
              "<strong>Payload:</strong> Contains claims and user data",
              "<strong>Signature:</strong> Used to verify token authenticity",
              "Format: header.payload.signature (Base64 encoded)"
            ]
          },
          {
            title: "Security Note",
            content: [
              "This tool only decodes tokens - it does not verify signatures",
              "Never trust JWT data without proper signature verification",
              "Use server-side libraries for production token validation",
              "Expired tokens should be rejected by your application"
            ]
          }
        ]}
      />
    </div>
  )
}