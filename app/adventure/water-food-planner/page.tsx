import { Metadata } from "next"
import AdventureToolClient from "./client"
import toolContent from "./water-food-planner.json"

export const metadata: Metadata = {
  title: toolContent.title + " | ToolsWorx",
  description: toolContent.description,
  alternates: { canonical: "/adventure/water-food-planner" },
}

export default function AdventureToolPage() {
  return <AdventureToolClient />
}
