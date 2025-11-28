"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AboutDescription } from "@/components/ui/about-description"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy, Check, Mail, Sparkles } from "lucide-react"

export default function EmailExtractorPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const processInput = () => {
    setError("")
    setOutput("")

    if (!input.trim()) {
      setError("Please enter text to extract emails from")
      return
    }

    try {
      // Email regex pattern
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
      const emails = input.match(emailRegex)
      
      if (emails && emails.length > 0) {
        // Remove duplicates and sort
        const uniqueEmails = [...new Set(emails)].sort()
        setOutput(uniqueEmails.join('\n'))
      } else {
        setOutput("No email addresses found")
      }
    } catch (e: any) {
      setError(`Processing failed: ${e.message}`)
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
        <h1 className="text-4xl font-bold mb-4">Email Extractor</h1>
        <p className="text-xl text-muted-foreground">
          Extract email addresses from any text instantly
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Input Text
            </CardTitle>
            <CardDescription>Paste text containing email addresses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your text here... Contact us at support@example.com or sales@company.org"
              className="font-mono text-sm min-h-[400px]"
            />

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={processInput} className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Extract Emails
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
              <Mail className="h-5 w-5" />
              Extracted Emails
              {output && output !== "No email addresses found" && (
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
            <CardDescription>Found email addresses (duplicates removed)</CardDescription>
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
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Extracted emails will appear here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AboutDescription
        title="About Email Extractor"
        description="Extract email addresses from any text using advanced regex patterns. Perfect for data processing, lead generation, and contact list management. All processing happens in your browser for privacy."
        sections={[
          {
            title: "Features",
            content: [
              "Extract emails from any text format",
              "Automatic duplicate removal",
              "Sorted alphabetical output",
              "Copy results with one click",
              "100% client-side processing for privacy"
            ]
          },
          {
            title: "How to Use",
            content: [
              "Paste your text containing email addresses",
              "Click 'Extract Emails' to find all valid emails",
              "Copy the clean list of unique emails",
              "Use for contact lists, lead generation, or data cleaning"
            ]
          },
          {
            title: "Supported Formats",
            content: [
              "Standard emails: user@domain.com",
              "Subdomains: user@mail.domain.com", 
              "Plus addressing: user+tag@domain.com",
              "Dots in username: first.last@domain.com",
              "Numbers and hyphens: user123@my-domain.org"
            ]
          }
        ]}
      />
    </div>
  )
}