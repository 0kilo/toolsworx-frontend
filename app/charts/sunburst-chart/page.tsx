"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChartTemplate } from "@/components/shared/chart-template"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, ImageIcon, FileText } from "lucide-react"
import * as d3 from "d3"
import toolContent from "./sunburst-chart.json"

interface SunburstNode {
  name: string
  value?: number
  children?: SunburstNode[]
}

interface SunburstData {
  title: string
  data: SunburstNode
}

export default function SunburstChartPage() {
  const [data, setData] = useState<SunburstData>(toolContent.exampleData as SunburstData)
  const chartRef = useRef<HTMLDivElement>(null)

  const renderChart = useCallback(() => {
    if (!chartRef.current || !data.data) return

    d3.select(chartRef.current).selectAll('*').remove()

    const width = 600
    const height = 600
    const radius = Math.min(width, height) / 2

    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`)

    const color = d3.scaleOrdinal(d3.schemeCategory10)

    const partition = d3.partition<SunburstNode>()
      .size([2 * Math.PI, radius])

    const root = d3.hierarchy(data.data)
      .sum(d => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0))

    partition(root)

    const arc = d3.arc<d3.HierarchyRectangularNode<SunburstNode>>()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1)

    g.selectAll('path')
      .data(root.descendants())
      .enter().append('path')
      .attr('d', d => arc(d as any))
      .style('fill', d => color(d.data.name))
      .style('stroke', '#fff')
      .style('stroke-width', 2)
      .append('title')
      .text(d => `${d.data.name}\n${d.value || 0}`)

    g.selectAll('text')
      .data(root.descendants().filter(d => {
        const node = d as any
        return d.depth && (node.y1 - node.y0) > 20
      }))
      .enter().append('text')
      .attr('transform', d => {
        const node = d as any
        const x = (node.x0 + node.x1) / 2 * 180 / Math.PI
        const y = (node.y0 + node.y1) / 2
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`
      })
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', 'white')
      .text(d => d.data.name)
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
    a.download = `${data.title.replace(/\s+/g, "_")}_sunburst_chart.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportJSON = () => {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.title.replace(/\s+/g, '_')}_sunburst_chart.json`
    a.click()
    URL.revokeObjectURL(url)
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
