import { Metadata } from "next"
import { GanttChart } from "@/components/shared/gantt-chart"

export const metadata: Metadata = {
  title: "Gantt Chart Generator - Create Project Timelines | Tools Worx",
  description: "Create interactive Gantt charts for project management. Upload JSON data or use our visual builder to generate professional project timelines.",
  keywords: ["gantt chart", "project timeline", "project management", "chart generator", "d3 visualization"],
}

export default function GanttChartPage() {
  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Gantt Chart Generator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create interactive Gantt charts for project management. Upload JSON data or use our visual property builder to generate professional project timelines.
        </p>
      </div>
      <GanttChart />
    </div>
  )
}