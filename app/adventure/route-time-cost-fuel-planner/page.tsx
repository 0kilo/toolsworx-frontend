import { Metadata } from "next"
import AdventureToolClient from "./client"
import toolContent from "./route-time-cost-fuel-planner.json"

export const metadata: Metadata = {
  title: toolContent.title + " | ToolsWorx",
  description: toolContent.description,
  alternates: { canonical: "/adventure/route-time-cost-fuel-planner" },
}

export default function AdventureToolPage() {
  return <AdventureToolClient />
}
