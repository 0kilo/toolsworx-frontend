import { BookOpen } from "lucide-react"
import { ConverterMetadata } from "@/types/converter"
import { blogAdventurePosts } from "./adventures/registry"
import { blogApplicationPosts } from "./applications/registry"
import { BlogPostMetadata } from "@/types/blog"

export const allBlogPosts: BlogPostMetadata[] = [...blogAdventurePosts, ...blogApplicationPosts]

export const blogTools: ConverterMetadata[] = allBlogPosts.map((post) => ({
  id: `blog-${post.id}`,
  title: post.title,
  description: post.description,
  category: "blog",
  icon: post.icon ?? BookOpen,
  href: post.href,
  keywords: post.tags ?? ["blog", "travel", "tools"],
  popular: true,
}))
