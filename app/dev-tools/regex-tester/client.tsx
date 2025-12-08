"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AboutDescription } from "@/components/ui/about-description"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Search, Sparkles } from "lucide-react"
import { testRegex, highlightMatches, type RegexMatch } from "@/lib/tools/logic/dev-tools/tool-regex"
import toolContent from "./regex-tester.json"

export default function RegextesterClient() {
  const [pattern, setPattern] = useState("")
  const [flags, setFlags] = useState("g")
  const [testString, setTestString] = useState("")
  const [matches, setMatches] = useState<RegexMatch[]>([])
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const runTest = () => {
    setError("")
    setMatches([])

    if (!pattern.trim()) {
      setError("Please enter a regex pattern")
      return
    }

    if (!testString.trim()) {
      setError("Please enter a test string")
      return
    }

    try {
      const result = testRegex({ pattern, flags, testString })
      setMatches(result.matches)
    } catch (e: any) {
      setError(`Invalid regex: ${e.message}`)
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleClear = () => {
    setPattern("")
    setTestString("")
    setMatches([])
    setError("")
    setCopied(false)
  }



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
              <Search className="h-5 w-5" />
              Regex Pattern & Test String
            </CardTitle>
            <CardDescription>Enter your regex pattern and test string</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pattern">Regular Expression</Label>
              <Input
                id="pattern"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter regex pattern (e.g., \d+|[a-z]+)"
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="flags">Flags</Label>
              <Input
                id="flags"
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                placeholder="g, i, m, s, u, y"
                className="font-mono"
                maxLength={10}
              />
              <p className="text-xs text-muted-foreground">
                g=global, i=ignoreCase, m=multiline, s=dotAll, u=unicode, y=sticky
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="testString">Test String</Label>
              <Textarea
                id="testString"
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                placeholder="Enter text to test against your regex..."
                className="font-mono text-sm min-h-[200px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={runTest} className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Test Regex
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
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Results
              {matches.length > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {matches.length} match{matches.length !== 1 ? 'es' : ''}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Matches and highlighted text</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm mb-4">
                {error}
              </div>
            )}

            {matches.length > 0 && (
              <div className="space-y-4">
                {/* Highlighted Text */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Highlighted Matches</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(testString)}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div 
                    className="p-3 bg-muted rounded-lg font-mono text-sm whitespace-pre-wrap border"
                    dangerouslySetInnerHTML={{ 
                      __html: highlightMatches(testString, matches) 
                    }}
                  />
                </div>

                {/* Match Details */}
                <div className="space-y-2">
                  <Label>Match Details</Label>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {matches.map((match, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg text-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">Match {index + 1}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(match.match)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="space-y-1 font-mono">
                          <div><span className="text-muted-foreground">Text:</span> "{match.match}"</div>
                          <div><span className="text-muted-foreground">Position:</span> {match.index}</div>
                          {match.groups && match.groups.length > 0 && (
                            <div>
                              <span className="text-muted-foreground">Groups:</span>
                              <div className="ml-4">
                                {match.groups.map((group, i) => (
                                  <div key={i}>Group {i + 1}: "{group}"</div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!matches.length && !error && testString && pattern && (
              <div className="flex items-center justify-center min-h-[200px] text-muted-foreground border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No matches found</p>
                </div>
              </div>
            )}

            {!testString && !pattern && (
              <div className="flex items-center justify-center min-h-[200px] text-muted-foreground border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter a regex pattern and test string to see results</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AboutDescription
        title={toolContent.aboutTitle}
        description={toolContent.aboutDescription}
        sections={toolContent.sections as any}
      />
    </div>
  )
}