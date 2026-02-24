import { BookOpen } from "lucide-react"
import { ConverterMetadata } from "@/types/converter"
import { blogAdventurePosts } from "./adventures/registry"
import { blogApplicationPosts } from "./applications/registry"
import { BlogPostMetadata } from "@/types/blog"
import { Atom } from "lucide-react"

export const allBlogPosts: BlogPostMetadata[] = [...blogAdventurePosts, ...blogApplicationPosts,

{
  id: "blog-generator",
  title: "Blog Generator",
  description: "Systematically and automatically generate blog page.",
  category: "blog",
  subcategory: "tools",
  icon: Atom,
  href: "/blog/blog-page-generator",
  tags: ["blog", "generator"],
},
]

export const blogTools: ConverterMetadata[] = allBlogPosts.map((post) => ({
  id: `blog-${post.id}`,
  title: post.title,
  description: post.description,
  subcategory: post.subcategory,
  category: "blog",
  icon: post.icon ?? BookOpen,
  href: post.href,
  keywords: post.tags ?? ["blog", "travel", "tools"],
  popular: true,
}))
