"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChartTemplate } from "@/components/shared/chart-template"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, ImageIcon, FileText } from "lucide-react"
import * as d3 from "d3"

interface ScatterData {
  title: string
  data: Array<{
    x: number
    y: number
    label?: string
    color?: string
  }>
}

const exampleData: ScatterData = {
  title: "Sales vs Marketing Spend",
  data: [
    { x: 100, y: 200, label: "Q1", color: "#3b82f6" },
    { x: 150, y: 300, label: "Q2", color: "#10b981" },
    { x: 200, y: 450, label: "Q3", color: "#f59e0b" },
    { x: 250, y: 500, label: "Q4", color: "#ef4444" },
    { x: 180, y: 380, label: "Q5", color: "#8b5cf6" }
  ]
}

const exampleJson = `{
  "title": "Sales vs Marketing Spend",
  "data": [
    { "x": 100, "y": 200, "label": "Q1", "color": "#3b82f6" },
    { "x": 150, "y": 300, "label": "Q2", "color": "#10b981" },
    { "x": 200, "y": 450, "label": "Q3", "color": "#f59e0b" },
    { "x": 250, "y": 500, "label": "Q4", "color": "#ef4444" }
  ]
}`

export default function ScatterChartPage() {
  const [data, setData] = useState<ScatterData>(exampleData)
  const chartRef = useRef<HTMLDivElement>(null)

  const renderChart = useCallback(() => {
    if (!chartRef.current || !data.data.length) return

    d3.select(chartRef.current).selectAll('*').remove()

    const margin = { top: 20, right: 30, bottom: 40, left: 50 }
    const width = 600 - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom

    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleLinear()
      .domain(d3.extent(data.data, d => d.x) as [number, number])
      .range([0, width])

    const y = d3.scaleLinear()
      .domain(d3.extent(data.data, d => d.y) as [number, number])
      .range([height, 0])

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))

    g.append('g')
      .call(d3.axisLeft(y))

    g.selectAll('.dot')
      .data(data.data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d.x))
      .attr('cy', d => y(d.y))
      .attr('r', 6)
      .attr('fill', d => d.color || '#3b82f6')

    if (data.data[0]?.label) {
      g.selectAll('.label')
        .data(data.data)
        .enter().append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.x) + 8)
        .attr('y', d => y(d.y) + 4)
        .attr('font-size', '12px')
        .text(d => d.label || '')
    }
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
    a.download = `${data.title.replace(/\s+/g, "_")}_scatter_chart.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportJSON = () => {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.title.replace(/\s+/g, '_')}_scatter_chart.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Scatter Chart Generator</h1>
        <p className="text-muted-foreground">Create scatter plots to show correlations between two variables</p>
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
        description="Configure your scatter chart using JSON data or import from external sources"
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