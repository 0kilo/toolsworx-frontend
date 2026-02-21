import { Metadata } from "next"
import AdventureToolClient from "./client"
import toolContent from "./trip-cost-estimator.json"

export const metadata: Metadata = {
  title: toolContent.title + " | ToolsWorx",
  description: toolContent.description,
  alternates: { canonical: "/adventure/trip-cost-estimator" },
}

export default function AdventureToolPage() {
  return <AdventureToolClient />
}
