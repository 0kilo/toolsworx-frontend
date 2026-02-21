import { Metadata } from "next"
import AdventureToolClient from "./client"
import toolContent from "./pace-eta-planner.json"

export const metadata: Metadata = {
  title: toolContent.title + " | ToolsWorx",
  description: toolContent.description,
  alternates: { canonical: "/adventure/pace-eta-planner" },
}

export default function AdventureToolPage() {
  return <AdventureToolClient />
}
