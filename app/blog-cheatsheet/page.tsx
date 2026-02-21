import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Blog Cheatsheet - ToolsWorx",
  description: "Quick links to Adventures and Application blog entries.",
  alternates: { canonical: "/blog-cheatsheet" },
}

export default function BlogCheatsheetPage() {
  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-4xl font-bold mb-4">Blog Cheatsheet</h1>
      <p className="text-muted-foreground mb-6">Quick links to Adventures and Application posts.</p>
      <Link href="/blog" className="underline underline-offset-4 font-semibold">
        Open Blog Category
      </Link>
    </div>
  )
}
