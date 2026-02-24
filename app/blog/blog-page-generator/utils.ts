import type { MediaBlock } from "./types"

export const escapeLiteral = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\r/g, "")

export const resolveMediaSource = (block: MediaBlock) => {
  if (block.sourceType === "url") {
    return block.url.trim()
  }
  if (!block.uploadedName) {
    return ""
  }
  return `/media/${block.uploadedName}`
}

export const getPreviewMediaSource = (block: MediaBlock) =>
  block.sourceType === "url" ? block.url.trim() : block.uploadedDataUrl
