"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChartTemplate } from "@/components/shared/chart-template"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, ImageIcon, FileText } from "lucide-react"
import * as d3 from "d3"

interface PieData {
  title: string
  data: Array<{
    label: string
    value: number
    color?: string
  }>
}

const exampleData: PieData = {
  title: "Market Share",
  data: [
    { label: "Product A", value: 30, color: "#3b82f6" },
    { label: "Product B", value: 25, color: "#10b981" },
    { label: "Product C", value: 20, color: "#f59e0b" },
    { label: "Product D", value: 15, color: "#ef4444" },
    { label: "Others", value: 10, color: "#8b5cf6" }
  ]
}

const exampleJson = `{
  "title": "Market Share",
  "data": [
    { "label": "Product A", "value": 30, "color": "#3b82f6" },
    { "label": "Product B", "value": 25, "color": "#10b981" },
    { "label": "Product C", "value": 20, "color": "#f59e0b" },
    { "label": "Product D", "value": 15, "color": "#ef4444" },
    { "label": "Others", "value": 10, "color": "#8b5cf6" }
  ]
}`

export default function PieChartPage() {
  const [data, setData] = useState<PieData>(exampleData)
  const chartRef = useRef<HTMLDivElement>(null)

  const renderChart = useCallback(() => {
    if (!chartRef.current || !data.data.length) return

    d3.select(chartRef.current).selectAll('*').remove()

    const width = 500
    const height = 400
    const radius = Math.min(width, height) / 2 - 40

    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`)

    const pie = d3.pie<any>()
      .value(d => d.value)
      .sort(null)

    const arc = d3.arc<any>()
      .innerRadius(0)
      .outerRadius(radius)

    const labelArc = d3.arc<any>()
      .innerRadius(radius + 10)
      .outerRadius(radius + 10)

    const arcs = g.selectAll('.arc')
      .data(pie(data.data))
      .enter().append('g')
      .attr('class', 'arc')

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => d.data.color || '#3b82f6')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)

    arcs.append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text(d => `${d.data.label} (${d.data.value}%)`)

    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 120}, 20)`)

    const legendItems = legend.selectAll('.legend-item')
      .data(data.data)
      .enter().append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`)

    legendItems.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', d => d.color || '#3b82f6')

    legendItems.append('text')
      .attr('x', 20)
      .attr('y', 12)
      .attr('font-size', '12px')
      .text(d => d.label)
  }, [data])

  useEffect(() => {
    renderChart()
  }, [renderChart])

  const handleDownload = () => {
    if (!chartRef.current) return
    const svg = chartRef.current.querySelector('svg')
    if (!svg) return

    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(svg)
    const blob = new Blob([svgString], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement("a")
    a.href = url
    a.download = `${data.title.replace(/\s+/g, "_")}_pie_chart.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportJSON = () => {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.title.replace(/\s+/g, '_')}_pie_chart.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Pie Chart Generator</h1>
        <p className="text-muted-foreground">Create interactive pie charts to show proportional data</p>
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
        title="Chart Data"
        description="Configure your pie chart using JSON data or import from external sources"
        data={data}
        onDataChange={setData}
        onDownload={handleDownload}
        exampleJson={exampleJson}
      >
        <div></div>
      </ChartTemplate>
    </div>
  )
}