"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AboutDescription } from "@/components/ui/about-description"
import { Button } from "@/components/ui/button"
import { Copy, Check, RefreshCw, KeyRound } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateIds, IdType } from "@/lib/tools/logic/helpful-calculators/helper-api-key"
import toolContent from "./api-key-generator.json"

const TYPE_LABELS: Record<IdType, string> = {
  "uuid-v1": "UUID v1 (Time + Node)",
  "uuid-v3": "UUID v3 (Namespace + Name)",
  "uuid-v4": "UUID v4 (Random)",
  "uuid-v5": "UUID v5 (Namespace + Name)",
  "uuid-v6": "UUID v6 (Reordered v1)",
  "uuid-v7": "UUID v7 (Time-ordered)",
  "nil": "NIL UUID (All zeros)",
  "max": "MAX UUID (All ones)",
  "api-key": "API Key (UUID-based)",
  "short-id": "Short ID (Base64URL)",
  "parse": "Parse UUID → Bytes",
  "stringify": "Stringify Bytes → UUID",
}

const TYPE_DESCRIPTIONS: Record<IdType, string> = {
  "uuid-v1": "Time-based UUID with node identifier (legacy systems).",
  "uuid-v3": "Deterministic ID using MD5 hash of namespace + name.",
  "uuid-v4": "Best for general unique IDs. Fully random and hard to guess.",
  "uuid-v5": "Deterministic ID using SHA-1 hash of namespace + name.",
  "uuid-v6": "Time-ordered reformat of v1 for better database indexing.",
  "uuid-v7": "Sortable by time while remaining globally unique. Great for databases.",
  "nil": "Special NIL UUID constant. Useful as a placeholder.",
  "max": "Special MAX UUID constant. Useful for range queries.",
  "api-key": "Readable API key built from a UUID without dashes and a prefix.",
  "short-id": "Compact, URL-safe ID for short links, filenames, or reference codes.",
  "parse": "Convert a UUID string into a 16-byte array.",
  "stringify": "Convert a 16-byte array back into a UUID string.",
}

export default function ApiKeyGeneratorClient() {
  const [type, setType] = useState<IdType>("uuid-v4")
  const [count, setCount] = useState("3")
  const [namespace, setNamespace] = useState("")
  const [name, setName] = useState("toolsworx.com")
  const [prefix, setPrefix] = useState("twx")
  const [uuidInput, setUuidInput] = useState("")
  const [bytesInput, setBytesInput] = useState("")
  const [ids, setIds] = useState<string[]>([])
  const [copied, setCopied] = useState<number | null>(null)

  const handleGenerate = async () => {
    const result = await generateIds({
      count: parseInt(count) || 1,
      type,
      namespace,
      name,
      prefix,
      uuidInput,
      bytesInput,
    })
    setIds(result.ids)
    setCopied(null)
  }

  const handleCopy = async (id: string, index: number) => {
    try {
      await navigator.clipboard.writeText(id)
      setCopied(index)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(ids.join("\n"))
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
        <p className="text-xl text-muted-foreground">{toolContent.pageDescription}</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Generate IDs
          </CardTitle>
          <CardDescription>Select a format, generate IDs, and copy them in seconds.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="type">ID type</Label>
              <Select value={type} onValueChange={(value) => setType(value as IdType)}>
                <SelectTrigger id="type" className="mt-1">
                  <SelectValue placeholder="Choose a type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">{TYPE_DESCRIPTIONS[type]}</p>
            </div>

            <div>
              <Label htmlFor="count">How many (1-50)</Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="50"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="mt-1"
                disabled={["nil", "max", "parse", "stringify"].includes(type)}
              />
            </div>
          </div>

          {(type === "uuid-v3" || type === "uuid-v5") && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="namespace">Namespace UUID</Label>
                <Input
                  id="namespace"
                  value={namespace}
                  onChange={(e) => setNamespace(e.target.value)}
                  placeholder="Enter a namespace UUID"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="name">Name (deterministic input)</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="toolsworx.com"
                  className="mt-1"
                />
              </div>
            </div>
          )}


          {type === "api-key" && (
            <div>
              <Label htmlFor="prefix">Prefix (optional)</Label>
              <Input
                id="prefix"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="twx"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-2">Example output: {prefix || "twx"}_2f1c4b6...</p>
            </div>
          )}

          {type === "parse" && (
            <div>
              <Label htmlFor="uuidInput">UUID to parse</Label>
              <Input
                id="uuidInput"
                value={uuidInput}
                onChange={(e) => setUuidInput(e.target.value)}
                placeholder="Enter a UUID (e.g. 550e8400-e29b-41d4-a716-446655440000)"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Output is a 16-byte array you can copy for binary storage.
              </p>
            </div>
          )}

          {type === "stringify" && (
            <div>
              <Label htmlFor="bytesInput">Bytes to stringify</Label>
              <Input
                id="bytesInput"
                value={bytesInput}
                onChange={(e) => setBytesInput(e.target.value)}
                placeholder="16 bytes like: 16, 32, 64, 128, ..."
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Enter 16 bytes separated by commas or spaces (decimal or hex like 0x1f).
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleGenerate} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate
            </Button>
            {ids.length > 1 && (
              <Button onClick={handleCopyAll} variant="outline">
                {copied === -1 ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
                Copy All
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Generated IDs ({ids.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {ids.length === 0 ? (
            <p className="text-muted-foreground">Click generate to create IDs.</p>
          ) : (
            <div className="space-y-2">
              {ids.map((id, index) => (
                <div
                  key={`${id}-${index}`}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg font-mono text-sm"
                >
                  <span>{id}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleCopy(id, index)}
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
          )}
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
