import { Metadata } from "next"
import AdventureToolClient from "./client"
import toolContent from "./offline-packing-checklist-exporter.json"

export const metadata: Metadata = {
  title: toolContent.title + " | ToolsWorx",
  description: toolContent.description,
  alternates: { canonical: "/adventure/offline-packing-checklist-exporter" },
}

export default function AdventureToolPage() {
  return <AdventureToolClient />
}
