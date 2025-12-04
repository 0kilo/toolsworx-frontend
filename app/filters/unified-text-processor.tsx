"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Copy, Download } from "lucide-react"

const OPERATIONS = [
  { value: "extract-emails", label: "Extract Emails" },
  { value: "extract-urls", label: "Extract URLs" },
  { value: "uppercase", label: "UPPERCASE" },
  { value: "lowercase", label: "lowercase" },
  { value: "titlecase", label: "Title Case" },
  { value: "camelcase", label: "camelCase" },
  { value: "snakecase", label: "snake_case" },
  { value: "json-format", label: "Format JSON" },
  { value: "json-minify", label: "Minify JSON" },
  { value: "xml-format", label: "Format XML" },
  { value: "csv-clean", label: "Clean CSV" },
]

export function UnifiedTextProcessor() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [operation, setOperation] = useState("extract-emails")

  const processText = () => {
    let result = ""

    try {
      switch (operation) {
        case "extract-emails":
          const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
          const emails = inputText.match(emailRegex) || []
          result = emails.join("\n")
          break

        case "extract-urls":
          const urlRegex = /(https?:\/\/[^\s]+)/g
          const urls = inputText.match(urlRegex) || []
          result = urls.join("\n")
          break

        case "uppercase":
          result = inputText.toUpperCase()
          break

        case "lowercase":
          result = inputText.toLowerCase()
          break

        case "titlecase":
          result = inputText.replace(/\w\S*/g, (txt) => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
          )
          break

        case "camelcase":
          result = inputText
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
              index === 0 ? word.toLowerCase() : word.toUpperCase()
            )
            .replace(/\s+/g, "")
          break

        case "snakecase":
          result = inputText
            .replace(/\W+/g, " ")
            .split(/ |\B(?=[A-Z])/)
            .map((word) => word.toLowerCase())
            .join("_")
          break

        case "json-format":
          const jsonObj = JSON.parse(inputText)
          result = JSON.stringify(jsonObj, null, 2)
          break

        case "json-minify":
          const jsonObjMin = JSON.parse(inputText)
          result = JSON.stringify(jsonObjMin)
          break

        case "xml-format":
          const formatted = inputText
            .replace(/>\s*</g, ">\n<")
            .split("\n")
            .map((line, index, arr) => {
              const indent = line.match(/^<\//g) ? arr.slice(0, index).filter(l => l.match(/^<[^\/]/)).length - 1 : arr.slice(0, index).filter(l => l.match(/^<[^\/]/)).length
              return "  ".repeat(Math.max(0, indent)) + line.trim()
            })
            .join("\n")
          result = formatted
          break

        case "csv-clean":
          result = inputText
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => line.split(",").map(cell => cell.trim()).join(","))
            .join("\n")
          break

        default:
          result = inputText
      }

      setOutputText(result)
    } catch (error) {
      setOutputText(`Error: ${error instanceof Error ? error.message : 'Processing failed'}`)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText)
  }

  const downloadText = () => {
    const blob = new Blob([outputText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.download = `${operation}-result.txt`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setInputText(event.target?.result as string)
    }
    reader.readAsText(file)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Text Processor & Data Tools
        </CardTitle>
        <CardDescription>Process text, extract data, and format code</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Operation</Label>
          <Select value={operation} onValueChange={setOperation}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OPERATIONS.map(op => (
                <SelectItem key={op.value} value={op.value}>
                  {op.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Input Text</Label>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your text here or upload a file..."
            className="min-h-[200px] font-mono text-sm"
          />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <label>
                <input
                  type="file"
                  accept=".txt,.json,.xml,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                Upload File
              </label>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setInputText("")}>
              Clear
            </Button>
          </div>
        </div>

        <Button onClick={processText} className="w-full">
          Process Text
        </Button>

        {outputText && (
          <div className="space-y-2">
            <Label>Output</Label>
            <Textarea
              value={outputText}
              readOnly
              className="min-h-[200px] font-mono text-sm"
            />
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button onClick={downloadText} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
