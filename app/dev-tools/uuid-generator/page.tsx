"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AboutDescription } from "@/components/ui/about-description"
import { Button } from "@/components/ui/button"
import { Copy, Check, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { generateUUID, generateUUIDs } from "@/lib/tools/logic/dev-tools/tool-uuid"
import toolContent from "./uuid-generator.json"

export default function UUIDGeneratorPage() {
  const [uuids, setUuids] = useState<string[]>([generateUUID()])
  const [count, setCount] = useState("1")
  const [copied, setCopied] = useState<number | null>(null)

  const generateBatch = () => {
    const result = generateUUIDs({ count: parseInt(count) || 1 })
    setUuids(result.uuids)
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
        <h1 className="text-4xl font-bold mb-4">{toolContent.pageTitle}</h1>
        <p className="text-xl text-muted-foreground">
          {toolContent.pageDescription}
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

      <AboutDescription
        title={toolContent.aboutTitle}
        description={toolContent.aboutDescription}
        sections={toolContent.sections}
      />
    </div>
  )
}
