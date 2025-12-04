"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AboutDescription } from "@/components/ui/about-description"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy, Check, Type } from "lucide-react"
import { convertTextCase } from "@/lib/tools/logic/dev-tools/tool-text-case"
import toolContent from "./text-case-converter.json"

export default function TextCaseConverterPage() {
  const [input, setInput] = useState("")
  const [results, setResults] = useState({
    uppercase: "",
    lowercase: "",
    titlecase: "",
    camelcase: "",
    pascalcase: "",
    snakecase: "",
    kebabcase: "",
    constantcase: ""
  })
  const [copied, setCopied] = useState("")

  const convertText = () => {
    if (!input.trim()) return
    const result = convertTextCase({ text: input })
    setResults(result)
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

  const handleClear = () => {
    setInput("")
    setResults({
      uppercase: "",
      lowercase: "",
      titlecase: "",
      camelcase: "",
      pascalcase: "",
      snakecase: "",
      kebabcase: "",
      constantcase: ""
    })
    setCopied("")
  }

  const caseTypes = [
    { key: "uppercase", label: "UPPERCASE", description: "ALL LETTERS CAPITALIZED" },
    { key: "lowercase", label: "lowercase", description: "all letters in lowercase" },
    { key: "titlecase", label: "Title Case", description: "First Letter Of Each Word Capitalized" },
    { key: "camelcase", label: "camelCase", description: "firstWordLowercaseRestCapitalized" },
    { key: "pascalcase", label: "PascalCase", description: "AllWordsCapitalizedNoSpaces" },
    { key: "snakecase", label: "snake_case", description: "words_separated_by_underscores" },
    { key: "kebabcase", label: "kebab-case", description: "words-separated-by-hyphens" },
    { key: "constantcase", label: "CONSTANT_CASE", description: "UPPERCASE_WITH_UNDERSCORES" }
  ]

  return (
    <div className="container py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">{toolContent.pageTitle}</h1>
        <p className="text-xl text-muted-foreground">
          {toolContent.pageDescription}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              Input Text
            </CardTitle>
            <CardDescription>Enter text to convert between different cases</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your text here..."
              className="min-h-[200px]"
            />

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={convertText} className="w-full">
                <Type className="h-4 w-4 mr-2" />
                Convert
              </Button>
              <Button onClick={handleClear} variant="outline" className="w-full">
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Converted Results</CardTitle>
            <CardDescription>All case format variations</CardDescription>
          </CardHeader>
          <CardContent>
            {results.uppercase ? (
              <div className="space-y-4">
                {caseTypes.map((caseType) => (
                  <div key={caseType.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{caseType.label}</div>
                        <div className="text-xs text-muted-foreground">{caseType.description}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(results[caseType.key as keyof typeof results], caseType.key)}
                      >
                        {copied === caseType.key ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="p-3 bg-muted rounded-lg font-mono text-sm break-all">
                      {results[caseType.key as keyof typeof results]}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[400px] text-muted-foreground border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <Type className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Converted text will appear here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AboutDescription
        title={toolContent.aboutTitle}
        description={toolContent.aboutDescription}
        sections={toolContent.sections}
      />
    </div>
  )
}