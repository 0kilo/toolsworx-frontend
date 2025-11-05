"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Copy, Check, RotateCcw } from "lucide-react"

interface DeveloperToolTemplateProps {
  title: string
  description: string
  inputLabel?: string
  outputLabel?: string
  inputPlaceholder?: string
  onProcess: (input: string) => string | Promise<string>
  actionButtonText?: string
  showClearButton?: boolean
  inputType?: "textarea" | "text"
  outputType?: "textarea" | "text"
  infoContent?: React.ReactNode
}

/**
 * Developer Tool Template
 *
 * Use this template for developer tools like JSON formatters, Base64 encoders,
 * regex testers, code minifiers, etc.
 *
 * @example
 * ```tsx
 * <DeveloperToolTemplate
 *   title="JSON Formatter"
 *   description="Format and validate JSON"
 *   inputLabel="Raw JSON"
 *   outputLabel="Formatted JSON"
 *   onProcess={(input) => JSON.stringify(JSON.parse(input), null, 2)}
 *   actionButtonText="Format JSON"
 * />
 * ```
 */
export function DeveloperToolTemplate({
  title,
  description,
  inputLabel = "Input",
  outputLabel = "Output",
  inputPlaceholder = "Enter your input here...",
  onProcess,
  actionButtonText = "Process",
  showClearButton = true,
  inputType = "textarea",
  outputType = "textarea",
  infoContent,
}: DeveloperToolTemplateProps) {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [processing, setProcessing] = useState(false)

  const handleProcess = async () => {
    setError("")
    setProcessing(true)

    try {
      const result = await onProcess(input)
      setOutput(result)
    } catch (err: any) {
      setError(err.message || "Processing error occurred")
      setOutput("")
    } finally {
      setProcessing(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleClear = () => {
    setInput("")
    setOutput("")
    setError("")
    setCopied(false)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tool</CardTitle>
          <CardDescription>Enter your input and click {actionButtonText.toLowerCase()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div className="space-y-2">
            <Label htmlFor="input">{inputLabel}</Label>
            {inputType === "textarea" ? (
              <textarea
                id="input"
                className="w-full min-h-[200px] p-3 border rounded-md font-mono text-sm"
                placeholder={inputPlaceholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            ) : (
              <input
                id="input"
                type="text"
                className="w-full p-3 border rounded-md font-mono text-sm"
                placeholder={inputPlaceholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleProcess()}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleProcess}
              className="flex-1"
              size="lg"
              disabled={!input || processing}
            >
              {processing ? "Processing..." : actionButtonText}
            </Button>
            {showClearButton && (
              <Button
                variant="outline"
                size="lg"
                onClick={handleClear}
                disabled={!input && !output}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive rounded-lg p-4">
              <p className="text-sm font-medium">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Output Section */}
          {output && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="output">{outputLabel}</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              {outputType === "textarea" ? (
                <textarea
                  id="output"
                  className="w-full min-h-[200px] p-3 border rounded-md font-mono text-sm bg-muted"
                  value={output}
                  readOnly
                />
              ) : (
                <input
                  id="output"
                  type="text"
                  className="w-full p-3 border rounded-md font-mono text-sm bg-muted"
                  value={output}
                  readOnly
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Section */}
      {infoContent && (
        <Card>
          <CardHeader>
            <CardTitle>About This Tool</CardTitle>
          </CardHeader>
          <CardContent>
            {infoContent}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
