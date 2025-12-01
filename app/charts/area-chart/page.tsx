"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChartTemplate } from "@/components/shared/chart-template"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, ImageIcon, FileText } from "lucide-react"
import * as d3 from "d3"

interface AreaData {
  title: string
  data: Array<{
    x: string | number
    y: number
  }>
  color?: string
}

const exampleData: AreaData = {
  title: "Website Traffic",
  color: "#3b82f6",
  data: [
    { x: "Jan", y: 1000 },
    { x: "Feb", y: 1200 },
    { x: "Mar", y: 1500 },
    { x: "Apr", y: 1800 },
    { x: "May", y: 2200 },
    { x: "Jun", y: 2000 }
  ]
}

const exampleJson = `{
  "title": "Website Traffic",
  "color": "#3b82f6",
  "data": [
    { "x": "Jan", "y": 1000 },
    { "x": "Feb", "y": 1200 },
    { "x": "Mar", "y": 1500 },
    { "x": "Apr", "y": 1800 },
    { "x": "May", "y": 2200 },
    { "x": "Jun", "y": 2000 }
  ]
}`

export default function AreaChartPage() {
  const [data, setData] = useState<AreaData>(exampleData)
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

    const x = d3.scaleBand()
      .rangeRound([0, width])
      .padding(0.1)
      .domain(data.data.map(d => d.x.toString()))

    const y = d3.scaleLinear()
      .rangeRound([height, 0])
      .domain([0, d3.max(data.data, d => d.y) || 0])

    const area = d3.area<any>()
      .x(d => (x(d.x.toString()) || 0) + x.bandwidth() / 2)
      .y0(height)
      .y1(d => y(d.y))
      .curve(d3.curveMonotoneX)

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))

    g.append('g')
      .call(d3.axisLeft(y))

    g.append('path')
      .datum(data.data)
      .attr('fill', data.color || '#3b82f6')
      .attr('fill-opacity', 0.6)
      .attr('stroke', data.color || '#3b82f6')
      .attr('stroke-width', 2)
      .attr('d', area)
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
    a.download = `${data.title.replace(/\s+/g, "_")}_area_chart.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportJSON = () => {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.title.replace(/\s+/g, '_')}_area_chart.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Area Chart Generator</h1>
        <p className="text-muted-foreground">Create area charts to show cumulative data over time</p>
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
        description="Configure your area chart using JSON data or import from external sources"
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