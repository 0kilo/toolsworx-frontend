"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy, Check, FileText, Sparkles } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function JSONFormatterPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [indent, setIndent] = useState("2")

  const formatJSON = () => {
    setError("")
    setOutput("")

    if (!input.trim()) {
      setError("Please enter JSON to format")
      return
    }

    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, parseInt(indent))
      setOutput(formatted)
    } catch (e: any) {
      setError(`Invalid JSON: ${e.message}`)
    }
  }

  const minifyJSON = () => {
    setError("")
    setOutput("")

    if (!input.trim()) {
      setError("Please enter JSON to minify")
      return
    }

    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
    } catch (e: any) {
      setError(`Invalid JSON: ${e.message}`)
    }
  }

  const validateJSON = () => {
    setError("")
    setOutput("")

    if (!input.trim()) {
      setError("Please enter JSON to validate")
      return
    }

    try {
      JSON.parse(input)
      setOutput("✓ Valid JSON")
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
        <h1 className="text-4xl font-bold mb-4">JSON Formatter & Validator</h1>
        <p className="text-xl text-muted-foreground">
          Format, validate, and minify JSON data instantly
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
            <CardDescription>Paste your JSON here</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"name": "John", "age": 30}'
              className="font-mono text-sm min-h-[400px]"
            />

            <div className="space-y-2">
              <Label htmlFor="indent">Indentation</Label>
              <Select value={indent} onValueChange={setIndent}>
                <SelectTrigger id="indent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 spaces</SelectItem>
                  <SelectItem value="4">4 spaces</SelectItem>
                  <SelectItem value="8">8 spaces</SelectItem>
                  <SelectItem value="1">Tab</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={formatJSON} className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Format
              </Button>
              <Button onClick={minifyJSON} variant="outline" className="w-full">
                Minify
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={validateJSON} variant="outline" className="w-full">
                Validate
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
              Output
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
            <CardDescription>Formatted JSON</CardDescription>
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
                  <p>Formatted JSON will appear here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* SEO Content */}
      <Card className="mt-8">
        <CardContent className="pt-6 prose prose-sm max-w-none">
          <h2>About JSON Formatter</h2>
          <p>
            Our JSON Formatter helps you format, validate, and minify JSON data instantly.
            Perfect for developers working with APIs, configuration files, or any JSON data.
            All processing happens in your browser - no data is sent to any server.
          </p>

          <h3>Features</h3>
          <ul>
            <li>Format JSON with customizable indentation</li>
            <li>Minify JSON to reduce file size</li>
            <li>Validate JSON syntax</li>
            <li>Copy formatted JSON with one click</li>
            <li>100% client-side processing for privacy</li>
          </ul>

          <h3>How to Use</h3>
          <ol>
            <li>Paste your JSON in the input field</li>
            <li>Choose your preferred indentation</li>
            <li>Click "Format", "Minify", or "Validate"</li>
            <li>Copy the result or continue editing</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
