import { renderInlinePreview } from "../inline-render"
import type { BlogBlock } from "../types"

interface PreviewRendererProps {
  blocks: BlogBlock[]
}

export function PreviewRenderer({ blocks }: PreviewRendererProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {blocks.map((block, index) => {
        if (block.kind === "text") {
          const lines = block.content.split("\n").filter((line) => line.trim())
          if (block.variant === "header") {
            const Tag = index === 0 ? "h1" : "h2"
            return (
              <Tag
                key={block.id}
                className={block.fontSize}
                style={{
                  fontFamily: block.fontFamily,
                  fontWeight: Number(block.fontWeight),
                  color: block.color
                }}
              >
                {renderInlinePreview(lines.join(" "))}
              </Tag>
            )
          }

          return (
            <div key={block.id}>
              {lines.map((line, idx) => {
                const trimmed = line.trim()
                const isImageOnly = /^\[\[img\s+[^\]]+\]\]$/.test(trimmed)
                if (isImageOnly) {
                  return (
                    <div key={`${block.id}-${idx}`} className="mb-3 clear-both">
                      {renderInlinePreview(trimmed)}
                    </div>
                  )
                }
                return (
                  <p
                    key={`${block.id}-${idx}`}
                    className={`${block.fontSize} leading-7 mb-3 overflow-hidden`}
                    style={{
                      fontFamily: block.fontFamily,
                      fontWeight: Number(block.fontWeight),
                      color: block.color
                    }}
                  >
                    {renderInlinePreview(line)}
                  </p>
                )
              })}
            </div>
          )
        }

        const src = block.sourceType === "url" ? block.url.trim() : block.uploadedDataUrl
        if (!src) {
          return (
            <div key={block.id} className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
              Media block has no source yet.
            </div>
          )
        }

        return (
          <figure key={block.id} className="space-y-2">
            {block.mediaType === "image" && <img src={src} alt={block.caption || "Preview media"} className="w-full rounded-lg border" />}
            {block.mediaType === "video" && <video src={src} controls className="w-full rounded-lg border" />}
            {block.mediaType === "audio" && <audio src={src} controls className="w-full" />}
            {block.caption && <figcaption className="text-sm text-muted-foreground">{block.caption}</figcaption>}
          </figure>
        )
      })}
    </div>
  )
}
