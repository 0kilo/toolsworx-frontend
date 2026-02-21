import { LucideIcon } from "lucide-react"

export interface BlogPostMetadata {
  id: string
  title: string
  description: string
  href: string
  subcategory: "adventures" | "applications"
  icon?: LucideIcon
  publishedAt?: string
  tags?: string[]
}
