"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AboutDescription } from "@/components/ui/about-description"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy, Check, FileText, Sparkles } from "lucide-react"

export default function XMLFormatterPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const processInput = () => {
    setError("")
    setOutput("")

    if (!input.trim()) {
      setError("Please enter XML to format")
      return
    }

    try {
      // Simple XML formatting using DOMParser (frontend only)
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(input.trim(), "text/xml")
      
      // Check for parsing errors
      const parserError = xmlDoc.getElementsByTagName("parsererror")
      if (parserError.length > 0) {
        setError("Invalid XML: " + parserError[0].textContent)
        return
      }

      // Format XML with indentation
      const formatted = formatXML(input.trim())
      setOutput(formatted)
    } catch (e: any) {
      setError(`Formatting failed: ${e.message}`)
    }
  }

  const formatXML = (xml: string): string => {
    const PADDING = '  ' // 2 spaces for indentation
    const reg = /(>)(<)(\/*)/g
    let formatted = xml.replace(reg, '$1\r\n$2$3')
    
    let pad = 0
    return formatted.split('\r\n').map((node) => {
      let indent = 0
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0
      } else if (node.match(/^<\/\w/) && pad > 0) {
        pad -= 1
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
        indent = 1
      } else {
        indent = 0
      }
      
      const padding = PADDING.repeat(pad)
      pad += indent
      return padding + node
    }).join('\r\n')
  }

  const minifyXML = () => {
    setError("")
    setOutput("")

    if (!input.trim()) {
      setError("Please enter XML to minify")
      return
    }

    try {
      // Remove whitespace between tags
      const minified = input.trim()
        .replace(/>\s+</g, '><')
        .replace(/\s+/g, ' ')
        .trim()
      
      setOutput(minified)
    } catch (e: any) {
      setError(`Minification failed: ${e.message}`)
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
        <h1 className="text-4xl font-bold mb-4">XML Formatter</h1>
        <p className="text-xl text-muted-foreground">
          Format, validate, and minify XML data instantly
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Input XML
            </CardTitle>
            <CardDescription>Paste your XML here</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='<root><item id="1"><name>Example</name></item></root>'
              className="font-mono text-sm min-h-[400px]"
            />

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={processInput} className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Format XML
              </Button>
              <Button onClick={minifyXML} variant="outline" className="w-full">
                Minify XML
              </Button>
            </div>
            <Button onClick={handleClear} variant="outline" className="w-full">
              Clear
            </Button>
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Formatted XML
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
            <CardDescription>Formatted or minified XML</CardDescription>
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
                  <p>Formatted XML will appear here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AboutDescription
        title="About XML Formatter"
        description="Format, validate, and minify XML data using browser-native parsing. Perfect for developers working with APIs, configuration files, or any XML data. All processing happens in your browser for privacy."
        sections={[
          {
            title: "Features",
            content: [
              "Format XML with proper indentation",
              "Minify XML to reduce file size",
              "Validate XML syntax using browser parser",
              "Copy formatted XML with one click",
              "100% client-side processing for privacy"
            ]
          },
          {
            title: "How to Use",
            content: [
              "Paste your XML in the input field",
              "Click 'Format XML' to add proper indentation",
              "Click 'Minify XML' to remove whitespace",
              "Copy the result or continue editing"
            ]
          },
          {
            title: "XML Use Cases",
            content: [
              "API responses and requests",
              "Configuration files",
              "Data exchange between systems",
              "Web service definitions (WSDL, SOAP)",
              "Document markup and structure",
              "RSS feeds and sitemaps"
            ]
          }
        ]}
      />
    </div>
  )
}