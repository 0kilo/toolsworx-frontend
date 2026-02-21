import { Metadata } from "next"
import AdventureToolClient from "./client"
import toolContent from "./emergency-info-card-generator.json"

export const metadata: Metadata = {
  title: toolContent.title + " | ToolsWorx",
  description: toolContent.description,
  alternates: { canonical: "/adventure/emergency-info-card-generator" },
}

export default function AdventureToolPage() {
  return <AdventureToolClient />
}
