import { Metadata } from "next"
import fs from "fs"
import path from "path"
import ReactMarkdown from "react-markdown"

export const metadata: Metadata = {
  title: "Tools — Vietnam Coastal Loop | ToolsWorx",
  description: "Trip-specific tools and services used on the Vietnam coastal loop.",
  alternates: { canonical: "/blog/resources/vietnam-coastal-loop/tools" },
}

const contentPath = path.join(process.cwd(), "app/blog/adventures/vietnam-coastal-loop/resources/tools/content.md")
const content = fs.readFileSync(contentPath, "utf8")

export default function ToolsPage() {
  return (
    <div className="container py-8 md:py-12 max-w-3xl">
      <article className="prose prose-neutral max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </div>
  )
}
