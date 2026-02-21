import { Metadata } from "next"
import AdventureToolClient from "./client"
import toolContent from "./ride-range-fuel-stop-planner.json"

export const metadata: Metadata = {
  title: toolContent.title + " | ToolsWorx",
  description: toolContent.description,
  alternates: { canonical: "/adventure/ride-range-fuel-stop-planner" },
}

export default function AdventureToolPage() {
  return <AdventureToolClient />
}
