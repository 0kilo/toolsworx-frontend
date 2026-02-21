"use client"

import { ChangeEvent, useMemo, useState } from "react"
import { AboutDescription } from "@/components/ui/about-description"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Download,
  FileCode2,
  ImageIcon,
  Link2,
  Plus,
  Trash2,
  Type
} from "lucide-react"
import toolContent from "./blog-page-generator.json"

type FontFamily = "sans-serif" | "serif" | "monospace"
type FontWeight = "400" | "500" | "600" | "700" | "800"
type TextVariant = "header" | "body"
type MediaType = "image" | "video" | "audio"
type MediaSourceType = "url" | "upload"

interface LinkItem {
  id: string
  label: string
  href: string
  color: string
}

interface TextBlock {
  id: string
  kind: "text"
  variant: TextVariant
  content: string
  fontFamily: FontFamily
  fontWeight: FontWeight
  color: string
  links: LinkItem[]
}

interface MediaBlock {
  id: string
  kind: "media"
  mediaType: MediaType
  sourceType: MediaSourceType
  url: string
  uploadedName: string
  uploadedDataUrl: string
  caption: string
}

type BlogBlock = TextBlock | MediaBlock

const defaultHeaderBlock = (): TextBlock => ({
  id: crypto.randomUUID(),
  kind: "text",
  variant: "header",
  content: "Your Blog Title",
  fontFamily: "sans-serif",
  fontWeight: "700",
  color: "#111827",
  links: []
})

const defaultBodyBlock = (): TextBlock => ({
  id: crypto.randomUUID(),
  kind: "text",
  variant: "body",
  content: "Write your blog content here.",
  fontFamily: "sans-serif",
  fontWeight: "400",
  color: "#1f2937",
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

const escapeLiteral = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\r/g, "")

const resolveMediaSource = (block: MediaBlock) => {
  if (block.sourceType === "url") {
    return block.url.trim()
  }
  if (!block.uploadedName) {
    return ""
  }
  return `/media/${block.uploadedName}`
}

const getPreviewMediaSource = (block: MediaBlock) =>
  block.sourceType === "url" ? block.url.trim() : block.uploadedDataUrl

function buildGeneratedTsx(blocks: BlogBlock[]) {
  const content = blocks
    .map((block, index) => {
      if (block.kind === "text") {
        const tag = block.variant === "header" && index === 0 ? "h1" : block.variant === "header" ? "h2" : "p"
        const sizeClass =
          block.variant === "header" && index === 0
            ? "text-4xl mb-4"
            : block.variant === "header"
              ? "text-2xl mb-3 mt-8"
              : "text-base leading-7 mb-4"

        const lines = block.content
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)

        const textElements =
          lines.length > 1
            ? lines
                .map(
                  (line) =>
                    `      <${tag} className="${sizeClass}" style={{ fontFamily: '${escapeLiteral(block.fontFamily)}', fontWeight: ${block.fontWeight}, color: '${escapeLiteral(block.color)}' }}>${escapeLiteral(line)}</${tag}>`
                )
                .join("\n")
            : `      <${tag} className="${sizeClass}" style={{ fontFamily: '${escapeLiteral(block.fontFamily)}', fontWeight: ${block.fontWeight}, color: '${escapeLiteral(block.color)}' }}>${escapeLiteral(lines[0] || "")}</${tag}>`

        const linkMarkup =
          block.variant === "body" && block.links.length > 0
            ? `\n      <div className="mb-6">\n        ${block.links
                .filter((link) => link.label.trim() && link.href.trim())
                .map(
                  (link) =>
                    `<a href="${escapeLiteral(link.href)}" className="underline underline-offset-4 mr-4" style={{ color: '${escapeLiteral(link.color)}' }}>${escapeLiteral(link.label)}</a>`
                )
                .join("\n        ")}\n      </div>`
            : ""

        return `${textElements}${linkMarkup}`
      }

      const mediaSrc = resolveMediaSource(block)
      const safeSrc = escapeLiteral(mediaSrc)
      const caption = block.caption.trim()

      if (block.mediaType === "image") {
        return [
          "      <figure className=\"mb-8\">",
          `        <img src="${safeSrc}" alt="${escapeLiteral(caption || "Blog media")}" className="w-full rounded-lg border" />`,
          caption ? `        <figcaption className="text-sm text-muted-foreground mt-2">${escapeLiteral(caption)}</figcaption>` : "",
          "      </figure>"
        ]
          .filter(Boolean)
          .join("\n")
      }

      if (block.mediaType === "video") {
        return [
          "      <figure className=\"mb-8\">",
          `        <video src="${safeSrc}" controls className="w-full rounded-lg border" />`,
          caption ? `        <figcaption className="text-sm text-muted-foreground mt-2">${escapeLiteral(caption)}</figcaption>` : "",
          "      </figure>"
        ]
          .filter(Boolean)
          .join("\n")
      }

      return [
        "      <figure className=\"mb-8\">",
        `        <audio src="${safeSrc}" controls className="w-full" />`,
        caption ? `        <figcaption className="text-sm text-muted-foreground mt-2">${escapeLiteral(caption)}</figcaption>` : "",
        "      </figure>"
      ]
        .filter(Boolean)
        .join("\n")
    })
    .join("\n\n")

  return `import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog Title | ToolsWorx Blog',
  description: 'Replace with your post description.',
  alternates: { canonical: '/blog/your-post-slug' },
}

export default function BlogPostPage() {
  return (
    <div className="container py-8 md:py-12 max-w-3xl">
      <article className="prose prose-neutral max-w-none">
${content}
      </article>
    </div>
  )
}
`
}

export default function BlogPageGeneratorClient() {
  const [blocks, setBlocks] = useState<BlogBlock[]>([defaultHeaderBlock(), defaultBodyBlock()])
  const [generatedTsx, setGeneratedTsx] = useState("")
  const [fileName, setFileName] = useState("my-blog-post")
  const [activeTab, setActiveTab] = useState("editor")

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
        links: [
          ...block.links,
          { id: crypto.randomUUID(), label: "New Link", href: "https://", color: "#2563eb" }
        ]
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
                    <Plus className="h-5 w-5" />
                    Toolbox
                  </CardTitle>
                  <CardDescription>Add blog components in the order you want.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button onClick={() => addTextBlock("header")} variant="outline">
                    <Type className="h-4 w-4 mr-2" />
                    Add Header Text
                  </Button>
                  <Button onClick={() => addTextBlock("body")} variant="outline">
                    <Type className="h-4 w-4 mr-2" />
                    Add Body Text
                  </Button>
                  <Button onClick={addMediaBlock} variant="outline">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Add Media
                  </Button>
                </CardContent>
              </Card>

              {blocks.map((block, index) => (
                <Card key={block.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>
                        Block {index + 1}: {block.kind === "text" ? `${block.variant === "header" ? "Header" : "Body"} Text` : "Media"}
                      </span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => moveBlock(block.id, "up")} disabled={index === 0}>
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveBlock(block.id, "down")}
                          disabled={index === blocks.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => removeBlock(block.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {block.kind === "text" ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Variant</Label>
                            <Select
                              value={block.variant}
                              onValueChange={(value: TextVariant) =>
                                updateBlock(block.id, (current) =>
                                  current.kind !== "text" ? current : { ...current, variant: value }
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="header">Header</SelectItem>
                                <SelectItem value="body">Body</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Font Family</Label>
                            <Select
                              value={block.fontFamily}
                              onValueChange={(value: FontFamily) =>
                                updateBlock(block.id, (current) =>
                                  current.kind !== "text" ? current : { ...current, fontFamily: value }
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sans-serif">Sans</SelectItem>
                                <SelectItem value="serif">Serif</SelectItem>
                                <SelectItem value="monospace">Monospace</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Font Weight</Label>
                            <Select
                              value={block.fontWeight}
                              onValueChange={(value: FontWeight) =>
                                updateBlock(block.id, (current) =>
                                  current.kind !== "text" ? current : { ...current, fontWeight: value }
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="400">400</SelectItem>
                                <SelectItem value="500">500</SelectItem>
                                <SelectItem value="600">600</SelectItem>
                                <SelectItem value="700">700</SelectItem>
                                <SelectItem value="800">800</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Text Color</Label>
                            <Input
                              type="color"
                              value={block.color}
                              onChange={(e) =>
                                updateBlock(block.id, (current) =>
                                  current.kind !== "text" ? current : { ...current, color: e.target.value }
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Text Content</Label>
                          <Textarea
                            rows={block.variant === "header" ? 3 : 6}
                            value={block.content}
                            onChange={(e) =>
                              updateBlock(block.id, (current) =>
                                current.kind !== "text" ? current : { ...current, content: e.target.value }
                              )
                            }
                          />
                        </div>

                        {block.variant === "body" && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label>Links</Label>
                              <Button size="sm" variant="outline" onClick={() => addLink(block.id)}>
                                <Link2 className="h-4 w-4 mr-2" />
                                Add Link
                              </Button>
                            </div>
                            {block.links.length === 0 && (
                              <p className="text-sm text-muted-foreground">
                                Add links to include them below this text block.
                              </p>
                            )}
                            {block.links.map((link) => (
                              <div key={link.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                                <div className="space-y-1">
                                  <Label>Label</Label>
                                  <Input
                                    value={link.label}
                                    onChange={(e) => updateLink(block.id, link.id, "label", e.target.value)}
                                  />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <Label>URL</Label>
                                  <Input
                                    value={link.href}
                                    onChange={(e) => updateLink(block.id, link.id, "href", e.target.value)}
                                  />
                                </div>
                                <div className="flex gap-2 items-center">
                                  <Input
                                    type="color"
                                    value={link.color}
                                    onChange={(e) => updateLink(block.id, link.id, "color", e.target.value)}
                                  />
                                  <Button size="icon" variant="ghost" onClick={() => removeLink(block.id, link.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Media Type</Label>
                            <Select
                              value={block.mediaType}
                              onValueChange={(value: MediaType) =>
                                updateBlock(block.id, (current) =>
                                  current.kind !== "media" ? current : { ...current, mediaType: value }
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="image">Image</SelectItem>
                                <SelectItem value="video">Video</SelectItem>
                                <SelectItem value="audio">Audio</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Source</Label>
                            <Select
                              value={block.sourceType}
                              onValueChange={(value: MediaSourceType) =>
                                updateBlock(block.id, (current) =>
                                  current.kind !== "media"
                                    ? current
                                    : {
                                        ...current,
                                        sourceType: value,
                                        url: value === "url" ? current.url : "",
                                        uploadedDataUrl: value === "upload" ? current.uploadedDataUrl : "",
                                        uploadedName: value === "upload" ? current.uploadedName : ""
                                      }
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="url">URL</SelectItem>
                                <SelectItem value="upload">Local Upload</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {block.sourceType === "url" ? (
                          <div className="space-y-2">
                            <Label>Media URL</Label>
                            <Input
                              placeholder="https://example.com/media.jpg"
                              value={block.url}
                              onChange={(e) =>
                                updateBlock(block.id, (current) =>
                                  current.kind !== "media" ? current : { ...current, url: e.target.value }
                                )
                              }
                            />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Label>Upload File</Label>
                            <Input type="file" accept="image/*,video/*,audio/*" onChange={(e) => handleUpload(block.id, e)} />
                            {block.uploadedName && (
                              <p className="text-sm text-muted-foreground">
                                Selected: {block.uploadedName}. Generated TSX will use `/media/{block.uploadedName}`.
                              </p>
                            )}
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label>Caption (optional)</Label>
                          <Input
                            value={block.caption}
                            onChange={(e) =>
                              updateBlock(block.id, (current) =>
                                current.kind !== "media" ? current : { ...current, caption: e.target.value }
                              )
                            }
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
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
                    <Label>File Name (without extension)</Label>
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
                    <div className="max-w-3xl mx-auto space-y-6">
                      {blocks.map((block, index) => {
                        if (block.kind === "text") {
                          const lines = block.content.split("\n").filter((line) => line.trim())
                          if (block.variant === "header") {
                            const Tag = index === 0 ? "h1" : "h2"
                            return (
                              <Tag
                                key={block.id}
                                className={index === 0 ? "text-4xl" : "text-2xl"}
                                style={{
                                  fontFamily: block.fontFamily,
                                  fontWeight: Number(block.fontWeight),
                                  color: block.color
                                }}
                              >
                                {lines.join(" ")}
                              </Tag>
                            )
                          }

                          return (
                            <div key={block.id}>
                              {lines.map((line, idx) => (
                                <p
                                  key={`${block.id}-${idx}`}
                                  className="leading-7 mb-3"
                                  style={{
                                    fontFamily: block.fontFamily,
                                    fontWeight: Number(block.fontWeight),
                                    color: block.color
                                  }}
                                >
                                  {line}
                                </p>
                              ))}
                              {block.links.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                                  {block.links
                                    .filter((link) => link.label.trim() && link.href.trim())
                                    .map((link) => (
                                      <a
                                        key={link.id}
                                        href={link.href}
                                        className="underline underline-offset-4"
                                        style={{ color: link.color }}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        {link.label}
                                      </a>
                                    ))}
                                </div>
                              )}
                            </div>
                          )
                        }

                        const src = getPreviewMediaSource(block)
                        if (!src) {
                          return (
                            <div key={block.id} className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                              Media block has no source yet.
                            </div>
                          )
                        }

                        return (
                          <figure key={block.id} className="space-y-2">
                            {block.mediaType === "image" && (
                              <img src={src} alt={block.caption || "Preview media"} className="w-full rounded-lg border" />
                            )}
                            {block.mediaType === "video" && (
                              <video src={src} controls className="w-full rounded-lg border" />
                            )}
                            {block.mediaType === "audio" && <audio src={src} controls className="w-full" />}
                            {block.caption && <figcaption className="text-sm text-muted-foreground">{block.caption}</figcaption>}
                          </figure>
                        )
                      })}
                    </div>
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
