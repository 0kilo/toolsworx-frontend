import { LucideIcon } from "lucide-react"

export interface BlogPostMetadata {
  id: string
  title: string
  description: string
  href: string
  category: string
  subcategory: "adventures" | "applications" | "tools"
  group?: string
  icon?: LucideIcon
  thumbnail?: string
  publishedAt?: string
  tags?: string[]
}
