import React from "react"

export const inlineImageClass = (align: string, width: string) => {
  const w =
    width === "quarter"
      ? "w-1/4"
      : width === "third"
        ? "w-1/3"
        : width === "half"
          ? "w-1/2"
          : "w-full"

  const alignClass =
    align === "left"
      ? "float-left mr-4 mb-2"
      : align === "right"
        ? "float-right ml-4 mb-2"
        : "mx-auto"

  return `${w} ${alignClass} inline-block max-w-full not-prose`
}

export const renderInlinePreview = (text: string) => {
  const parts: React.ReactNode[] = []
  const regex = /\[\[img\s+([^\]]+)\]\]|\[([^\]]+)\]\(([^)]+)\)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text))) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    if (match[0].startsWith("[[img")) {
      const attrs = match[1]
      const src = /src="([^"]+)"/.exec(attrs)?.[1] ?? ""
      const align = /align="([^"]+)"/.exec(attrs)?.[1] ?? "right"
      const width = /width="([^"]+)"/.exec(attrs)?.[1] ?? "half"
      const caption = /caption="([^"]+)"/.exec(attrs)?.[1] ?? ""

      parts.push(
        <span key={`${match.index}-img`} className={inlineImageClass(align, width)}>
          <img src={src} alt={caption || "Inline image"} className="rounded-lg border max-w-full not-prose" />
          {caption && <span className="block text-xs text-muted-foreground mt-1 not-prose">{caption}</span>}
        </span>
      )
    } else {
      const label = match[2]
      const href = match[3]
      parts.push(
        <a
          key={`${match.index}-link`}
          href={href}
          className="underline underline-offset-4"
          target="_blank"
          rel="noreferrer"
        >
          {label}
        </a>
      )
    }

    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}
