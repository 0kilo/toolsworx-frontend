import { Metadata } from "next"
import fs from "fs"
import path from "path"
import ReactMarkdown from "react-markdown"

export const metadata: Metadata = {
  title: "Tips — Vietnam Coastal Loop | ToolsWorx",
  description: "Trip-specific tips learned on the Vietnam coastal loop.",
  alternates: { canonical: "/blog/adventures/vietnam/vietnam-coastal-loop/resources/tips" },
}

const contentPath = path.join(process.cwd(), "app/blog/adventures/vietnam/vietnam-coastal-loop/resources/tips/content.md")
const content = fs.readFileSync(contentPath, "utf8")

export default function TipsPage() {
  return (
    <div className="container py-8 md:py-12 max-w-3xl">
      <article className="prose prose-neutral max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </div>
  )
}
