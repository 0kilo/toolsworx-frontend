"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AboutDescription } from "@/components/ui/about-description"
import { BarChart3 } from "lucide-react"

export default function TemplateChartPage() {
  const [chartData, setChartData] = useState("")

  const generateChart = () => {
    // Template chart generation logic
    console.log("Generating chart...")
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Template Chart Generator</h1>
            <p className="text-muted-foreground">
              Create template charts for data visualization
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Template Chart Generator
              </CardTitle>
              <CardDescription>
                Generate interactive charts from your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Button onClick={generateChart} className="w-full">
                  Generate Chart
                </Button>
              </div>
            </CardContent>
          </Card>

          <AboutDescription
            title="About Template Charts"
            description="Create interactive charts for data visualization and project management."
            sections={[
              {
                title: "Features",
                content: [
                  "Interactive chart generation",
                  "Data import support",
                  "Export capabilities"
                ]
              },
              {
                title: "Use Cases",
                content: [
                  "Data visualization",
                  "Project management",
                  "Timeline creation"
                ]
              }
            ]}
          />
        </div>

        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}