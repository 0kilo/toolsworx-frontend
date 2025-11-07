"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"
import { Hash, Copy, Check } from "lucide-react"

export default function HashGeneratorPage() {
  const [input, setInput] = useState("")
  const [algorithm, setAlgorithm] = useState("md5")
  const [hash, setHash] = useState("")
  const [copied, setCopied] = useState(false)

  const generateHash = async () => {
    if (!input) return

    try {
      let result = ""
      
      if (algorithm === "md5") {
        // Simple MD5 implementation for demo
        result = await simpleHash(input, "MD5")
      } else if (algorithm === "sha1") {
        result = await simpleHash(input, "SHA-1")
      } else if (algorithm === "sha256") {
        result = await simpleHash(input, "SHA-256")
      } else if (algorithm === "base64") {
        result = btoa(input)
      }
      
      setHash(result)
    } catch (error) {
      setHash("Error generating hash")
    }
  }

  const simpleHash = async (text: string, algorithm: string) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest(algorithm, data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
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
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setInput(result)
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Hash Generator</h1>
            <p className="text-muted-foreground">
              Generate MD5, SHA-1, SHA-256 hashes and Base64 encoding
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

              <Button onClick={generateHash} className="w-full">
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

          <FooterAd />

          <AboutDescription
            title="About Hash Functions"
            description="Hash functions convert input data into fixed-size strings. They're essential for security, data integrity, and password storage."
            sections={[
              {
                title: "Hash Types",
                content: [
                  "<strong>MD5:</strong> 128-bit hash, fast but not secure for passwords",
                  "<strong>SHA-1:</strong> 160-bit hash, deprecated for security applications",
                  "<strong>SHA-256:</strong> 256-bit hash, secure and widely used",
                  "<strong>Base64:</strong> Encoding (not hashing) for data transmission"
                ]
              },
              {
                title: "Common Uses",
                content: [
                  "Password storage (use SHA-256 with salt)",
                  "File integrity verification",
                  "Digital signatures and certificates",
                  "Blockchain and cryptocurrency",
                  "Data deduplication"
                ]
              },
              {
                title: "Security Notes",
                content: [
                  "Never use MD5 or SHA-1 for passwords",
                  "Always use salt with password hashes",
                  "SHA-256 is currently secure for most applications",
                  "Consider bcrypt or Argon2 for password hashing"
                ]
              }
            ]}
          />
        </div>

        <div className="lg:col-span-1">
          <SidebarAd />
        </div>
      </div>
    </div>
  )
}