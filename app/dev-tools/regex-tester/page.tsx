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

interface Match {
  match: string
  index: number
  groups?: string[]
}

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState("")
  const [flags, setFlags] = useState("g")
  const [testString, setTestString] = useState("")
  const [matches, setMatches] = useState<Match[]>([])
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const testRegex = () => {
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
      const regex = new RegExp(pattern, flags)
      const foundMatches: Match[] = []
      
      if (flags.includes('g')) {
        let match
        while ((match = regex.exec(testString)) !== null) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          })
          if (match.index === regex.lastIndex) break
        }
      } else {
        const match = regex.exec(testString)
        if (match) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          })
        }
      }

      setMatches(foundMatches)
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

  const highlightMatches = (text: string, matches: Match[]) => {
    if (matches.length === 0) return text

    let result = ""
    let lastIndex = 0

    matches.forEach((match, i) => {
      result += text.slice(lastIndex, match.index)
      result += `<mark class="bg-yellow-200 px-1 rounded">${match.match}</mark>`
      lastIndex = match.index + match.match.length
    })
    result += text.slice(lastIndex)

    return result
  }

  return (
    <div className="container py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Regex Tester</h1>
        <p className="text-xl text-muted-foreground">
          Test and debug regular expressions with live matching and highlighting
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
              <Button onClick={testRegex} className="w-full">
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
        title="About Regex Tester"
        description="Test and debug regular expressions with live matching, highlighting, and detailed match information. Perfect for developers, data analysts, and anyone working with pattern matching."
        sections={[
          {
            title: "Features",
            content: [
              "Live regex testing with instant results",
              "Visual highlighting of matches in text",
              "Detailed match information including position and groups",
              "Support for all JavaScript regex flags",
              "Copy matches and results with one click",
              "100% client-side processing for privacy"
            ]
          },
          {
            title: "How to Use",
            content: [
              "Enter your regular expression pattern",
              "Set appropriate flags (g for global, i for case-insensitive, etc.)",
              "Enter your test string",
              "Click 'Test Regex' to see matches and highlights",
              "Copy individual matches or the full result"
            ]
          },
          {
            title: "Common Regex Patterns",
            content: [
              "<code>\\d+</code> - Match one or more digits",
              "<code>[a-zA-Z]+</code> - Match letters only",
              "<code>\\w+@\\w+\\.\\w+</code> - Simple email pattern",
              "<code>https?://[^\\s]+</code> - Match URLs",
              "<code>\\b\\w{4}\\b</code> - Match 4-letter words"
            ]
          }
        ]}
      />
    </div>
  )
}