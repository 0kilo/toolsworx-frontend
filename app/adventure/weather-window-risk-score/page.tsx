import { Metadata } from "next"
import AdventureToolClient from "./client"
import toolContent from "./weather-window-risk-score.json"

export const metadata: Metadata = {
  title: toolContent.title + " | ToolsWorx",
  description: toolContent.description,
  alternates: { canonical: "/adventure/weather-window-risk-score" },
}

export default function AdventureToolPage() {
  return <AdventureToolClient />
}
