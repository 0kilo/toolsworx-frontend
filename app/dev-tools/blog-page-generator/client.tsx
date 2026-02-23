"use client"

import { ChangeEvent, useMemo, useState } from "react"
import { AboutDescription } from "@/components/ui/about-description"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Download, FileCode2 } from "lucide-react"
import toolContent from "./blog-page-generator.json"
import { BlockCard } from "./components/BlockCard"
import { MediaBlockEditor } from "./components/MediaBlockEditor"
import { PreviewRenderer } from "./components/PreviewRenderer"
import { TextBlockEditor } from "./components/TextBlockEditor"
import { Toolbox } from "./components/Toolbox"
import { buildGeneratedTsx } from "./build-generated"
import type { BlogBlock, FontFamily, FontSize, FontWeight, LinkItem, MediaBlock, MediaType, TextBlock, TextVariant } from "./types"

const defaultHeaderBlock = (): TextBlock => ({
  id: crypto.randomUUID(),
  kind: "text",
  variant: "header",
  content: "Your Blog Title",
  fontFamily: "sans-serif",
  fontWeight: "700",
  fontSize: "text-4xl",
  color: "#111827",
  links: []
})

const defaultBodyBlock = (): TextBlock => ({
  id: crypto.randomUUID(),
  kind: "text",
  variant: "body",
  content: "Published: ",
  fontFamily: "sans-serif",
  fontWeight: "400",
  fontSize: "text-base",
  color: "#818892",
  links: []
})

const defaultMediaBlock = (): MediaBlock => ({
  id: crypto.randomUUID(),
  kind: "media",
  mediaType: "image",
  sourceType: "url",
  url: "",
  uploadedName: "",
  uploadedDataUrl: "",
  caption: ""
})

export default function BlogPageGeneratorClient() {
  const [blocks, setBlocks] = useState<BlogBlock[]>([defaultHeaderBlock(), defaultBodyBlock()])
  const [generatedTsx, setGeneratedTsx] = useState("")
  const [fileName, setFileName] = useState("my-blog-post")
  const [activeTab, setActiveTab] = useState("editor")
  const [collapsedBlocks, setCollapsedBlocks] = useState<Record<string, boolean>>({})
  const [selectionMap, setSelectionMap] = useState<Record<string, { start: number; end: number }>>({})

  const hasPreviewContent = useMemo(() => blocks.length > 0, [blocks.length])

  const addTextBlock = (variant: TextVariant) => {
    setBlocks((prev) => [...prev, variant === "header" ? defaultHeaderBlock() : defaultBodyBlock()])
  }

  const addMediaBlock = () => {
    setBlocks((prev) => [...prev, defaultMediaBlock()])
  }

  const updateBlock = (id: string, updater: (block: BlogBlock) => BlogBlock) => {
    setBlocks((prev) => prev.map((block) => (block.id === id ? updater(block) : block)))
  }

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== id))
  }

  const moveBlock = (id: string, direction: "up" | "down") => {
    setBlocks((prev) => {
      const index = prev.findIndex((block) => block.id === id)
      if (index === -1) return prev
      const target = direction === "up" ? index - 1 : index + 1
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      const [item] = next.splice(index, 1)
      next.splice(target, 0, item)
      return next
    })
  }

  const handleUpload = (id: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      updateBlock(id, (block) => {
        if (block.kind !== "media") return block
        return {
          ...block,
          sourceType: "upload",
          uploadedName: file.name,
          uploadedDataUrl: typeof reader.result === "string" ? reader.result : ""
        }
      })
    }
    reader.readAsDataURL(file)
  }

  const addLink = (id: string) => {
    updateBlock(id, (block) => {
      if (block.kind !== "text" || block.variant !== "body") return block
      return {
        ...block,
        links: [...block.links, { id: crypto.randomUUID(), label: "New Link", href: "https://", color: "#2563eb" }]
      }
    })
  }

  const updateLink = (blockId: string, linkId: string, field: keyof LinkItem, value: string) => {
    updateBlock(blockId, (block) => {
      if (block.kind !== "text" || block.variant !== "body") return block
      return {
        ...block,
        links: block.links.map((link) => (link.id === linkId ? { ...link, [field]: value } : link))
      }
    })
  }

  const removeLink = (blockId: string, linkId: string) => {
    updateBlock(blockId, (block) => {
      if (block.kind !== "text" || block.variant !== "body") return block
      return { ...block, links: block.links.filter((link) => link.id !== linkId) }
    })
  }

  const insertSnippet = (id: string, snippet: string) => {
    updateBlock(id, (block) => {
      if (block.kind !== "text") return block
      const content = block.content || ""
      const sel = selectionMap[id] ?? { start: content.length, end: content.length }
      const before = content.slice(0, sel.start)
      const after = content.slice(sel.end)
      const next = `${before}${snippet}${after}`
      const cursor = sel.start + snippet.length
      setSelectionMap((prev) => ({ ...prev, [id]: { start: cursor, end: cursor } }))
      return { ...block, content: next }
    })
  }

  const importTsx = (tsx: string) => {
    const blockMatches = [...tsx.matchAll(/<(h1|h2|p)[^>]*className="([^"]*)"[^>]*style=\{\{[^}]*\}\}[^>]*>\{renderInline\('([^']*)'\)\}<\/\1>/g)]
    if (!blockMatches.length) return
    const nextBlocks: BlogBlock[] = blockMatches.map((match) => {
      const tag = match[1]
      const className = match[2]
      const content = match[3].replace(/\\'/g, "'")
      const styleMatch = match[0]
      const color = /color:\s*'([^']+)'/.exec(styleMatch)?.[1] ?? (tag === "h1" ? "#111827" : "#1f2937")
      const fontWeight = /fontWeight:\s*(\d+)/.exec(styleMatch)?.[1] as FontWeight | undefined
      const fontFamily = /fontFamily:\s*'([^']+)'/.exec(styleMatch)?.[1] as FontFamily | undefined
      const fontSizeMatch = /(text-(?:xs|sm|base|lg|xl|2xl|3xl|4xl))/.exec(className)
      const fontSize = (fontSizeMatch?.[1] as FontSize) ?? (tag === "h1" ? "text-4xl" : tag === "h2" ? "text-2xl" : "text-base")

      if (tag === "h1" || tag === "h2") {
        return {
          ...defaultHeaderBlock(),
          variant: "header",
          content,
          fontSize,
          color,
          fontWeight: fontWeight ?? "700",
          fontFamily: fontFamily ?? "sans-serif"
        }
      }
      return {
        ...defaultBodyBlock(),
        variant: "body",
        content,
        fontSize,
        color,
        fontWeight: fontWeight ?? "400",
        fontFamily: fontFamily ?? "sans-serif"
      }
    })
    setBlocks(nextBlocks)
    setActiveTab("editor")
  }

  const handleGenerate = () => {
    const tsx = buildGeneratedTsx(blocks)
    setGeneratedTsx(tsx)
    setActiveTab("output")
  }

  const handleDownload = () => {
    if (!generatedTsx) return
    const slug = fileName.trim().replace(/[^a-z0-9-]/gi, "-").replace(/-+/g, "-").toLowerCase() || "blog-page"
    const blob = new Blob([generatedTsx], { type: "text/tsx;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${slug}.tsx`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleCopy = async () => {
    if (!generatedTsx) return
    await navigator.clipboard.writeText(generatedTsx)
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{toolContent.pageTitle}</h1>
            <p className="text-muted-foreground">{toolContent.pageDescription}</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="output">Generated TSX</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCode2 className="h-5 w-5" />
                    Toolbox
                  </CardTitle>
                  <CardDescription>Add blog components in the order you want.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Toolbox
                    onAddText={addTextBlock}
                    onAddMedia={addMediaBlock}
                    onImport={() => {
                      const input = document.createElement("input")
                      input.type = "file"
                      input.accept = ".tsx,.ts,.txt"
                      input.onchange = async () => {
                        const file = input.files?.[0]
                        if (!file) return
                        const text = await file.text()
                        importTsx(text)
                      }
                      input.click()
                    }}
                  />
                </CardContent>
              </Card>

              {blocks.map((block, index) => (
                <BlockCard
                  key={block.id}
                  title={block.kind === "text" ? `${block.variant === "header" ? "Header" : "Body"} Text` : "Media"}
                  index={index}
                  total={blocks.length}
                  collapsed={!!collapsedBlocks[block.id]}
                  onToggle={() =>
                    setCollapsedBlocks((prev) => ({
                      ...prev,
                      [block.id]: !prev[block.id]
                    }))
                  }
                  onMoveUp={() => moveBlock(block.id, "up")}
                  onMoveDown={() => moveBlock(block.id, "down")}
                  onRemove={() => removeBlock(block.id)}
                >
                  {block.kind === "text" ? (
                    <TextBlockEditor
                      block={block}
                      onUpdate={(next) => updateBlock(block.id, () => next)}
                      onAddLink={() => addLink(block.id)}
                      onUpdateLink={(linkId, field, value) => updateLink(block.id, linkId, field, value)}
                      onRemoveLink={(linkId) => removeLink(block.id, linkId)}
                      onInsertSnippet={(snippet) => insertSnippet(block.id, snippet)}
                      onSelect={(start, end) =>
                        setSelectionMap((prev) => ({
                          ...prev,
                          [block.id]: { start, end }
                        }))
                      }
                    />
                  ) : (
                    <MediaBlockEditor
                      block={block}
                      onUpdate={(next) => updateBlock(block.id, () => next)}
                      onUpload={(event) => handleUpload(block.id, event)}
                    />
                  )}
                </BlockCard>
              ))}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCode2 className="h-5 w-5" />
                    Generate TSX
                  </CardTitle>
                  <CardDescription>Build and download a ready-to-edit page file.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Input value={fileName} onChange={(e) => setFileName(e.target.value)} />
                  </div>
                  <Button onClick={handleGenerate} className="w-full">
                    Generate TSX
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>Preview rendering of your current block order and styling.</CardDescription>
                </CardHeader>
                <CardContent>
                  {!hasPreviewContent ? (
                    <p className="text-muted-foreground">Add blocks from the toolbox to preview the page.</p>
                  ) : (
                    <PreviewRenderer blocks={blocks} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="output" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generated TSX File</CardTitle>
                  <CardDescription>
                    Generate first, then copy or download. Adjust metadata/title/canonical path before deploying.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={generatedTsx}
                    readOnly
                    rows={24}
                    className="font-mono text-xs"
                    placeholder="Your generated TSX will appear here."
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={handleCopy} variant="outline" disabled={!generatedTsx}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button onClick={handleDownload} disabled={!generatedTsx}>
                      <Download className="h-4 w-4 mr-2" />
                      Download TSX
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <AboutDescription
            title={toolContent.aboutTitle}
            description={toolContent.aboutDescription}
            sections={toolContent.sections as any}
          />
        </div>

        <div className="lg:col-span-1" />
      </div>
    </div>
  )
}
