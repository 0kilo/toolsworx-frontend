"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Simple UUID v4 generator
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export default function UUIDGeneratorPage() {
  const [uuids, setUuids] = useState<string[]>([generateUUID()])
  const [count, setCount] = useState("1")
  const [copied, setCopied] = useState<number | null>(null)

  const generateBatch = () => {
    const num = Math.min(Math.max(1, parseInt(count) || 1), 100)
    const newUuids = Array.from({ length: num }, () => generateUUID())
    setUuids(newUuids)
    setCopied(null)
  }

  const handleCopy = async (uuid: string, index: number) => {
    try {
      await navigator.clipboard.writeText(uuid)
      setCopied(index)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(uuids.join('\n'))
      setCopied(-1)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="container py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">UUID Generator</h1>
        <p className="text-xl text-muted-foreground">
          Generate unique UUIDs (Universally Unique Identifiers)
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Generate UUIDs</CardTitle>
          <CardDescription>Create one or multiple UUIDs at once</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="count">Number of UUIDs (1-100)</Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={generateBatch} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate
            </Button>
            {uuids.length > 1 && (
              <Button onClick={handleCopyAll} variant="outline">
                {copied === -1 ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
                Copy All
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated UUIDs ({uuids.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {uuids.map((uuid, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg font-mono text-sm"
              >
                <span>{uuid}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleCopy(uuid, index)}
                >
                  {copied === index ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardContent className="pt-6 prose prose-sm max-w-none">
          <h2>About UUIDs</h2>
          <p>
            A UUID (Universally Unique Identifier) is a 128-bit number used to uniquely identify
            information in computer systems. The probability of generating duplicate UUIDs is
            negligibly small.
          </p>

          <h3>UUID Format</h3>
          <p>
            UUIDs are typically displayed as 32 hexadecimal digits, displayed in five groups
            separated by hyphens: <code>xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx</code>
          </p>

          <h3>Common Uses</h3>
          <ul>
            <li>Database primary keys</li>
            <li>Session identifiers</li>
            <li>Unique file names</li>
            <li>API request tracking</li>
            <li>Distributed systems coordination</li>
          </ul>

          <h3>UUID Version 4</h3>
          <p>
            This tool generates Version 4 UUIDs, which are randomly generated. The 4 most
            significant bits of the 7th byte are set to 0100 (version 4), and the 2-3 most
            significant bits of the 9th byte are set to 10 (variant 1).
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
