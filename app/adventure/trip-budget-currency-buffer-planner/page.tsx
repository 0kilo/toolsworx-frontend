import { Metadata } from "next"
import AdventureToolClient from "./client"
import toolContent from "./trip-budget-currency-buffer-planner.json"

export const metadata: Metadata = {
  title: toolContent.title + " | ToolsWorx",
  description: toolContent.description,
  alternates: { canonical: "/adventure/trip-budget-currency-buffer-planner" },
}

export default function AdventureToolPage() {
  return <AdventureToolClient />
}
