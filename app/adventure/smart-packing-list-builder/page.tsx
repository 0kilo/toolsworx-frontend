import { Metadata } from "next"
import AdventureToolClient from "./client"
import toolContent from "./smart-packing-list-builder.json"

export const metadata: Metadata = {
  title: toolContent.title + " | ToolsWorx",
  description: toolContent.description,
  alternates: { canonical: "/adventure/smart-packing-list-builder" },
}

export default function AdventureToolPage() {
  return <AdventureToolClient />
}
