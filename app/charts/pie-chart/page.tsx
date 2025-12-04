"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChartTemplate } from "@/components/shared/chart-template"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, ImageIcon, FileText } from "lucide-react"
import { renderPieChart, exportPieChartSVG, exportPieChartJSON, type PieChartData } from "@/lib/tools/logic/charts/chart-pie"
import toolContent from "./pie-chart.json"

export default function PieChartPage() {
  const [data, setData] = useState<PieChartData>(toolContent.exampleData as PieChartData)
  const chartRef = useRef<HTMLDivElement>(null)

  const renderChart = useCallback(() => {
    if (!chartRef.current || !data.data.length) return
    renderPieChart(chartRef.current, data)
  }, [data])

  useEffect(() => {
    renderChart()
  }, [renderChart])

  const handleDownload = () => {
    if (!chartRef.current) return
    exportPieChartSVG(chartRef.current, data.title)
  }

  const handleExportJSON = () => {
    exportPieChartJSON(data)
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{toolContent.pageTitle}</h1>
        <p className="text-muted-foreground">{toolContent.pageDescription}</p>
      </div>

      <Card>
        <CardContent>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">{data.title}</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleDownload}>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Export as SVG
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportJSON}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div ref={chartRef} className="w-full flex justify-center"></div>
        </CardContent>
      </Card>

      <ChartTemplate
        title={toolContent.chartDataTitle}
        description={toolContent.chartDataDescription}
        data={data}
        onDataChange={setData}
        onDownload={handleDownload}
        exampleJson={toolContent.exampleJson}
      >
        <div></div>
      </ChartTemplate>
    </div>
  )
}