export type FontFamily = "sans-serif" | "serif" | "monospace"
export type FontWeight = "400" | "500" | "600" | "700" | "800"
export type FontSize = "text-xs" | "text-sm" | "text-base" | "text-lg" | "text-xl" | "text-2xl" | "text-3xl" | "text-4xl"
export type TextVariant = "header" | "body"
export type MediaType = "image" | "video" | "audio"
export type MediaSourceType = "url" | "upload"

export interface LinkItem {
  id: string
  label: string
  href: string
  color: string
}

export interface TextBlock {
  id: string
  kind: "text"
  variant: TextVariant
  content: string
  fontFamily: FontFamily
  fontWeight: FontWeight
  fontSize: FontSize
  color: string
  links: LinkItem[]
}

export interface MediaBlock {
  id: string
  kind: "media"
  mediaType: MediaType
  sourceType: MediaSourceType
  url: string
  uploadedName: string
  uploadedDataUrl: string
  caption: string
}

export type BlogBlock = TextBlock | MediaBlock
