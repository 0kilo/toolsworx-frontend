"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AboutDescription } from "@/components/ui/about-description"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy, Check, Table, Sparkles } from "lucide-react"

export default function CSVFormatterPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const processInput = () => {
    setError("")
    setOutput("")

    if (!input.trim()) {
      setError("Please enter CSV data to format")
      return
    }

    try {
      // Simple CSV parsing and formatting (frontend only)
      const lines = input.trim().split('\n')
      const rows = lines.map(line => parseCSVLine(line))
      
      // Find max width for each column
      const maxWidths = rows.reduce((widths, row) => {
        row.forEach((cell, index) => {
          widths[index] = Math.max(widths[index] || 0, cell.length)
        })
        return widths
      }, [] as number[])

      // Format as aligned table
      const formatted = rows.map(row => 
        row.map((cell, index) => cell.padEnd(maxWidths[index] || 0)).join(' | ')
      ).join('\n')

      setOutput(formatted)
    } catch (e: any) {
      setError(`Formatting failed: ${e.message}`)
    }
  }

  const parseCSVLine = (line: string): string[] => {
    const result = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    
    result.push(current.trim())
    return result
  }

  const convertToJSON = () => {
    setError("")
    setOutput("")

    if (!input.trim()) {
      setError("Please enter CSV data to convert")
      return
    }

    try {
      const lines = input.trim().split('\n')
      if (lines.length < 2) {
        setError("CSV must have at least a header row and one data row")
        return
      }

      const headers = parseCSVLine(lines[0])
      const data = lines.slice(1).map(line => {
        const values = parseCSVLine(line)
        const obj: Record<string, string> = {}
        headers.forEach((header, index) => {
          obj[header] = values[index] || ''
        })
        return obj
      })

      setOutput(JSON.stringify(data, null, 2))
    } catch (e: any) {
      setError(`Conversion failed: ${e.message}`)
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
        <h1 className="text-4xl font-bold mb-4">CSV Formatter</h1>
        <p className="text-xl text-muted-foreground">
          Format CSV data as aligned tables or convert to JSON
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Table className="h-5 w-5" />
              Input CSV
            </CardTitle>
            <CardDescription>Paste your CSV data here</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Name,Age,City\nJohn Doe,30,New York\nJane Smith,25,Los Angeles`}
              className="font-mono text-sm min-h-[400px]"
            />

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={processInput} className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Format Table
              </Button>
              <Button onClick={convertToJSON} variant="outline" className="w-full">
                Convert to JSON
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
              <Table className="h-5 w-5" />
              Formatted Output
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
            <CardDescription>Formatted table or JSON output</CardDescription>
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
                  <Table className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Formatted output will appear here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AboutDescription
        title="About CSV Formatter"
        description="Format CSV data as aligned tables or convert to JSON format. Perfect for data analysis, reporting, and data transformation tasks. All processing happens in your browser for privacy."
        sections={[
          {
            title: "Features",
            content: [
              "Format CSV as aligned, readable tables",
              "Convert CSV to JSON format",
              "Handle quoted fields and commas",
              "Copy formatted results with one click",
              "100% client-side processing for privacy"
            ]
          },
          {
            title: "How to Use",
            content: [
              "Paste your CSV data in the input field",
              "Click 'Format Table' for aligned table view",
              "Click 'Convert to JSON' for JSON format",
              "Copy the result for use in other applications"
            ]
          },
          {
            title: "CSV Best Practices",
            content: [
              "Use quotes around fields containing commas",
              "Include header row for better JSON conversion",
              "Escape quotes within fields by doubling them",
              "Keep consistent column count across rows",
              "Use UTF-8 encoding for international characters"
            ]
          }
        ]}
      />
    </div>
  )
}