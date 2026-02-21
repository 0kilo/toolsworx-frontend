import { Metadata } from "next"
import AdventureToolClient from "./client"
import toolContent from "./ride-fueling-calculator.json"

export const metadata: Metadata = {
  title: toolContent.title + " | ToolsWorx",
  description: toolContent.description,
  alternates: { canonical: "/adventure/ride-fueling-calculator" },
}

export default function AdventureToolPage() {
  return <AdventureToolClient />
}
