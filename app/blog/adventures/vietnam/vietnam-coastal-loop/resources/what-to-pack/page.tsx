import { Metadata } from "next"
import fs from "fs"
import path from "path"
import ReactMarkdown from "react-markdown"

export const metadata: Metadata = {
  title: "What to Pack — Vietnam Coastal Loop | ToolsWorx",
  description: "Trip-specific packing list with reasons and affiliate-ready links.",
  alternates: { canonical: "/blog/adventures/vietnam/vietnam-coastal-loop/resources/what-to-pack" },
}

const contentPath = path.join(process.cwd(), "app/blog/adventures/vietnam/vietnam-coastal-loop/resources/what-to-pack/content.md")
const content = fs.readFileSync(contentPath, "utf8")

export default function WhatToPackPage() {
  return (
    <div className="container py-8 md:py-12 max-w-3xl">
      <article className="prose prose-neutral max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </div>
  )
}
