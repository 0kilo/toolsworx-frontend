"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Copy, RefreshCw, Key } from "lucide-react"
import { generatePassword } from "@/lib/tools/logic/helpful-calculators/helper-password"
import { AboutDescription } from "@/components/ui/about-description"
import toolContent from "./password-generator.json"

export default function PasswordgeneratorClient() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState(16)
  const [uppercase, setUppercase] = useState(true)
  const [lowercase, setLowercase] = useState(true)
  const [numbers, setNumbers] = useState(true)
  const [symbols, setSymbols] = useState(true)
  const [copied, setCopied] = useState(false)

  const handleGenerate = () => {
    const result = generatePassword({ length, uppercase, lowercase, numbers, symbols })
    setPassword(result.password)
    setCopied(false)
  }

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const resetOptions = () => {
    setLength(16)
    setUppercase(true)
    setLowercase(true)
    setNumbers(true)
    setSymbols(true)
    setPassword("")
    setCopied(false)
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{toolContent.pageTitle}</h1>
          <p className="text-muted-foreground">
            {toolContent.pageDescription}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Generate Password
            </CardTitle>
            <CardDescription>
              Create a secure password with your preferred settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Generated Password Display */}
            <div className="space-y-2">
              <Label>Generated Password</Label>
              <div className="flex gap-2">
                <Input
                  value={password}
                  readOnly
                  placeholder="Click generate to create password"
                  className="font-mono text-lg"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  disabled={!password}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              {copied && (
                <p className="text-sm text-green-600">Copied to clipboard!</p>
              )}
            </div>

            {/* Length Slider */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Password Length</Label>
                <span className="text-sm text-muted-foreground">{length} characters</span>
              </div>
              <Slider
                value={[length]}
                onValueChange={(value) => setLength(value[0])}
                min={4}
                max={64}
                step={1}
                className="w-full"
              />
            </div>

            {/* Options */}
            <div className="space-y-4">
              <Label>Character Types</Label>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="uppercase"
                  checked={uppercase}
                  onCheckedChange={(checked) => setUppercase(checked as boolean)}
                />
                <label
                  htmlFor="uppercase"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Uppercase Letters (A-Z)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lowercase"
                  checked={lowercase}
                  onCheckedChange={(checked) => setLowercase(checked as boolean)}
                />
                <label
                  htmlFor="lowercase"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Lowercase Letters (a-z)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="numbers"
                  checked={numbers}
                  onCheckedChange={(checked) => setNumbers(checked as boolean)}
                />
                <label
                  htmlFor="numbers"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Numbers (0-9)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="symbols"
                  checked={symbols}
                  onCheckedChange={(checked) => setSymbols(checked as boolean)}
                />
                <label
                  htmlFor="symbols"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Symbols (!@#$%^&*)
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button onClick={handleGenerate} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate Password
              </Button>
              <Button variant="outline" onClick={resetOptions}>
                Reset
              </Button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Password Strength</p>
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded ${
                        length >= 8 && (uppercase || lowercase) && numbers && symbols
                          ? i < 4 ? "bg-green-500" : "bg-gray-300"
                          : length >= 8 && ((uppercase || lowercase) && (numbers || symbols))
                          ? i < 3 ? "bg-yellow-500" : "bg-gray-300"
                          : length >= 6
                          ? i < 2 ? "bg-orange-500" : "bg-gray-300"
                          : i < 1 ? "bg-red-500" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {length >= 8 && (uppercase || lowercase) && numbers && symbols
                    ? "Very Strong"
                    : length >= 8 && ((uppercase || lowercase) && (numbers || symbols))
                    ? "Strong"
                    : length >= 6
                    ? "Medium"
                    : "Weak"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <AboutDescription
          title={toolContent.aboutTitle}
          description={toolContent.aboutDescription}
          sections={toolContent.sections}
        />
      </div>
    </div>
  )
}