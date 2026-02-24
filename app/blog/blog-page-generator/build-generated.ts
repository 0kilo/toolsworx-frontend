import type { BlogBlock } from "./types"
import { escapeLiteral, resolveMediaSource } from "./utils"

export function buildGeneratedTsx(blocks: BlogBlock[]) {
  const content = blocks
    .map((block, index) => {
      if (block.kind === "text") {
        const tag = block.variant === "header" && index === 0 ? "h1" : block.variant === "header" ? "h2" : "p"
        const sizeClass =
          block.variant === "header" && index === 0
            ? `${block.fontSize} mb-4`
            : block.variant === "header"
              ? `${block.fontSize} mb-3 mt-8`
              : `${block.fontSize} leading-7 mb-4`

        const lines = block.content
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)

        const renderLine = (line: string) => {
          const trimmed = line.trim()
          const isImageOnly = /^\[\[img\s+[^\]]+\]\]$/.test(trimmed)
          if (isImageOnly) {
            return `      <div className="mb-4 clear-both">{renderInline('${escapeLiteral(trimmed)}')}</div>`
          }
          return `      <${tag} className="${sizeClass}" style={{ fontFamily: '${escapeLiteral(block.fontFamily)}', fontWeight: ${block.fontWeight}, color: '${escapeLiteral(block.color)}' }}>{renderInline('${escapeLiteral(line)}')}</${tag}>`
        }

        const textElements =
          lines.length > 1 ? lines.map(renderLine).join("\n") : renderLine(lines[0] || "")

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
          `        <img src=\"${safeSrc}\" alt=\"${escapeLiteral(caption || "Blog media")}\" className=\"w-full rounded-lg border\" />`,
          caption ? `        <figcaption className=\"text-sm text-muted-foreground mt-2\">${escapeLiteral(caption)}</figcaption>` : "",
          "      </figure>"
        ]
          .filter(Boolean)
          .join("\n")
      }

      if (block.mediaType === "video") {
        return [
          "      <figure className=\"mb-8\">",
          `        <video src=\"${safeSrc}\" controls className=\"w-full rounded-lg border\" />`,
          caption ? `        <figcaption className=\"text-sm text-muted-foreground mt-2\">${escapeLiteral(caption)}</figcaption>` : "",
          "      </figure>"
        ]
          .filter(Boolean)
          .join("\n")
      }

      return [
        "      <figure className=\"mb-8\">",
        `        <audio src=\"${safeSrc}\" controls className=\"w-full\" />`,
        caption ? `        <figcaption className=\"text-sm text-muted-foreground mt-2\">${escapeLiteral(caption)}</figcaption>` : "",
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

const inlineImageClass = (align: string, width: string) => {
  const w = width === 'quarter' ? 'w-1/4' : width === 'third' ? 'w-1/3' : width === 'half' ? 'w-1/2' : 'w-full'
  const alignClass = align === 'left' ? 'float-left mr-4 mb-2' : align === 'right' ? 'float-right ml-4 mb-2' : 'mx-auto'
  return w + ' ' + alignClass + ' inline-block max-w-full not-prose'
}

const renderInline = (text: string) => {
  const parts = []
  const regex = /\\[\\[img\\s+([^\\]]+)\\]\\]|\\[([^\\]]+)\\]\\(([^)]+)\\)/g
  let lastIndex = 0
  let match
  while ((match = regex.exec(text))) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))
    if (match[0].startsWith('[[img')) {
      const attrs = match[1]
      const src = /src=\"([^\"]+)\"/.exec(attrs)?.[1] ?? ''
      const align = /align=\"([^\"]+)\"/.exec(attrs)?.[1] ?? 'right'
      const width = /width=\"([^\"]+)\"/.exec(attrs)?.[1] ?? 'half'
      const caption = /caption=\"([^\"]+)\"/.exec(attrs)?.[1] ?? ''
      parts.push(
        <span key={'img-' + match.index} className={inlineImageClass(align, width)}>
          <img src={src} alt={caption || 'Inline image'} className=\"rounded-lg border max-w-full not-prose\" />
          {caption ? <span className=\"block text-xs text-muted-foreground mt-1 not-prose\">{caption}</span> : null}
        </span>
      )
    } else {
      const label = match[2]
      const href = match[3]
      parts.push(
        <a key={'link-' + match.index} href={href} className=\"underline underline-offset-4\" target=\"_blank\" rel=\"noreferrer\">
          {label}
        </a>
      )
    }
    lastIndex = regex.lastIndex
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts
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
