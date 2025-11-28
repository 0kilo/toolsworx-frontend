"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AboutDescription } from "@/components/ui/about-description"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy, Check, FileText, Sparkles } from "lucide-react"

export default function JSONMinifierPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const processInput = () => {
    setError("")
    setOutput("")

    if (!input.trim()) {
      setError("Please enter JSON to minify")
      return
    }

    try {
      // Parse and minify JSON
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
    } catch (e: any) {
      setError(`Invalid JSON: ${e.message}`)
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
        <h1 className="text-4xl font-bold mb-4">JSON Minifier</h1>
        <p className="text-xl text-muted-foreground">
          Minify JSON data to reduce file size and remove whitespace
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Input JSON
            </CardTitle>
            <CardDescription>Paste formatted JSON to minify</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`{\n  "name": "John Doe",\n  "age": 30,\n  "city": "New York"\n}`}
              className="font-mono text-sm min-h-[400px]"
            />

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={processInput} className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Minify JSON
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
              <FileText className="h-5 w-5" />
              Minified JSON
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
            <CardDescription>Compressed JSON without whitespace</CardDescription>
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
                  <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Minified JSON will appear here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AboutDescription
        title="About JSON Minifier"
        description="Minify JSON data by removing unnecessary whitespace, line breaks, and indentation. Perfect for reducing file sizes and optimizing data transmission. All processing happens in your browser for privacy."
        sections={[
          {
            title: "Features",
            content: [
              "Remove all unnecessary whitespace",
              "Compress JSON to smallest possible size",
              "Validate JSON syntax during minification",
              "Copy minified result with one click",
              "100% client-side processing for privacy"
            ]
          },
          {
            title: "How to Use",
            content: [
              "Paste your formatted JSON in the input field",
              "Click 'Minify JSON' to compress the data",
              "Copy the minified result",
              "Use for API payloads, configuration files, or storage optimization"
            ]
          },
          {
            title: "Benefits of Minification",
            content: [
              "Reduced file size - up to 50% smaller",
              "Faster data transmission over networks",
              "Lower bandwidth usage",
              "Improved API response times",
              "Reduced storage requirements",
              "Better performance in web applications"
            ]
          }
        ]}
      />
    </div>
  )
}