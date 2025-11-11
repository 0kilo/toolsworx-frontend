import { Metadata } from "next"
import { ConverterCard } from "@/components/shared/converter-card"
import { chartTools } from "@/lib/categories/charts/registry"

export const metadata: Metadata = {
  title: "Charts & Visualizations - Interactive Chart Generator | Tools Worx",
  description: "Create interactive charts and visualizations with D3.js. Generate Gantt charts, import JSON data, and build custom visualizations with our chart tools.",
  keywords: ["charts", "data visualization", "gantt chart", "d3 charts", "interactive charts", "chart generator"],
}

export default function ChartsPage() {
  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Charts & Visualizations</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create beautiful, interactive charts and visualizations. Import JSON data or use our visual builders to generate professional charts for presentations and reports.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chartTools.map((tool) => (
          <ConverterCard key={tool.id} converter={tool} />
        ))}
      </div>
    </div>
  )
}