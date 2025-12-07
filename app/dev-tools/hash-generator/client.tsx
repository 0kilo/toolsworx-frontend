"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AboutDescription } from "@/components/ui/about-description"
import { Hash, Copy, Check } from "lucide-react"
import { generateHash, generateRandomString, type HashInput } from "@/lib/tools/logic/dev-tools/tool-hash"
import toolContent from "./hash-generator.json"

export default function HashgeneratorClient() {
  const [input, setInput] = useState("")
  const [algorithm, setAlgorithm] = useState("md5")
  const [hash, setHash] = useState("")
  const [copied, setCopied] = useState(false)

  const handleGenerateHash = async () => {
    if (!input) return

    try {
      const hashInput: HashInput = {
        text: input,
        algorithm: algorithm as HashInput["algorithm"]
      }
      const result = await generateHash(hashInput)
      setHash(result.hash)
    } catch (error: any) {
      setHash(error.message || "Error generating hash")
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hash)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const generateRandom = () => {
    setInput(generateRandomString(32))
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{toolContent.pageTitle}</h1>
            <p className="text-muted-foreground">
              {toolContent.pageDescription}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Hash Generator
              </CardTitle>
              <CardDescription>
                Create cryptographic hashes for passwords, data integrity, and security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="input">Input Text</Label>
                <div className="flex gap-2">
                  <Textarea
                    id="input"
                    placeholder="Enter text to hash"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={3}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={generateRandom}>
                    Random
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="algorithm">Hash Algorithm</Label>
                <Select value={algorithm} onValueChange={setAlgorithm}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="md5">MD5</SelectItem>
                    <SelectItem value="sha1">SHA-1</SelectItem>
                    <SelectItem value="sha256">SHA-256</SelectItem>
                    <SelectItem value="base64">Base64</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleGenerateHash} className="w-full">
                Generate Hash
              </Button>

              {hash && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Generated Hash</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Textarea value={hash} readOnly rows={3} className="font-mono text-sm" />
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

        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}