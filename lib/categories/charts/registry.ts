import { ConverterMetadata } from "@/types/converter"
import { BarChart3 } from "lucide-react"

export const chartTools: ConverterMetadata[] = [
  {
    id: "gantt-chart",
    title: "Gantt Chart Generator",
    description: "Create interactive Gantt charts for project management",
    category: "chart",
    icon: BarChart3,
    href: "/charts/gantt-chart",
    keywords: ["gantt", "chart", "project", "timeline", "schedule", "management"],
    popular: true,
  },
]