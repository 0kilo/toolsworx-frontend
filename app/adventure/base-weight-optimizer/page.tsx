import { Metadata } from "next"
import AdventureToolClient from "./client"
import toolContent from "./base-weight-optimizer.json"

export const metadata: Metadata = {
  title: toolContent.title + " | ToolsWorx",
  description: toolContent.description,
  alternates: { canonical: "/adventure/base-weight-optimizer" },
}

export default function AdventureToolPage() {
  return <AdventureToolClient />
}
