"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChartTemplate } from "@/components/shared/chart-template"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, ImageIcon, FileText } from "lucide-react"
import * as d3 from "d3"
import toolContent from "./usa-map.json"

interface StateData {
  state: string
  value: number
}

interface USAMapData {
  title: string
  data: StateData[]
}

export default function UsamapClient() {
  const [data, setData] = useState<USAMapData>(toolContent.exampleData as USAMapData)
  const chartRef = useRef<HTMLDivElement>(null)

  const renderChart = useCallback(() => {
    if (!chartRef.current || !data.data.length) return

    d3.select(chartRef.current).selectAll('*').remove()

    const width = 800
    const height = 500

    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)

    const valueMap = new Map(data.data.map(d => [d.state, d.value]))
    const maxValue = d3.max(data.data, d => d.value) || 1

    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, maxValue])

    // Simplified state positions (approximate)
    const statePositions: Record<string, { x: number, y: number, abbr: string }> = {
      "California": { x: 100, y: 250, abbr: "CA" },
      "Texas": { x: 350, y: 350, abbr: "TX" },
      "Florida": { x: 600, y: 380, abbr: "FL" },
      "New York": { x: 650, y: 150, abbr: "NY" },
      "Pennsylvania": { x: 620, y: 180, abbr: "PA" },
      "Illinois": { x: 450, y: 200, abbr: "IL" },
      "Ohio": { x: 550, y: 200, abbr: "OH" },
      "Georgia": { x: 580, y: 320, abbr: "GA" },
      "North Carolina": { x: 620, y: 280, abbr: "NC" },
      "Michigan": { x: 520, y: 150, abbr: "MI" },
      "Washington": { x: 80, y: 80, abbr: "WA" },
      "Arizona": { x: 180, y: 320, abbr: "AZ" },
      "Massachusetts": { x: 700, y: 140, abbr: "MA" },
      "Tennessee": { x: 540, y: 280, abbr: "TN" },
      "Indiana": { x: 510, y: 220, abbr: "IN" },
      "Missouri": { x: 430, y: 260, abbr: "MO" },
      "Maryland": { x: 640, y: 220, abbr: "MD" },
      "Wisconsin": { x: 470, y: 150, abbr: "WI" },
      "Colorado": { x: 250, y: 240, abbr: "CO" },
      "Minnesota": { x: 420, y: 120, abbr: "MN" }
    }

    // Draw states as circles
    const states = svg.selectAll('g')
      .data(data.data)
      .enter().append('g')
      .attr('transform', d => {
        const pos = statePositions[d.state] || { x: 400, y: 250 }
        return `translate(${pos.x},${pos.y})`
      })

    states.append('circle')
      .attr('r', d => Math.sqrt(d.value) * 5)
      .attr('fill', d => colorScale(d.value))
      .attr('stroke', '#333')
      .attr('stroke-width', 1.5)
      .append('title')
      .text(d => `${d.state}: ${d.value}`)

    states.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('fill', 'white')
      .text(d => statePositions[d.state]?.abbr || d.state.substring(0, 2).toUpperCase())

    // Legend
    const legendWidth = 200
    const legendHeight = 20
    const legend = svg.append('g')
      .attr('transform', `translate(${width - legendWidth - 50}, ${height - 50})`)

    const legendScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, legendWidth])

    const legendAxis = d3.axisBottom(legendScale)
      .ticks(5)

    const defs = svg.append('defs')
    const linearGradient = defs.append('linearGradient')
      .attr('id', 'legend-gradient')

    linearGradient.selectAll('stop')
      .data(d3.range(0, 1.1, 0.1))
      .enter().append('stop')
      .attr('offset', d => `${d * 100}%`)
      .attr('stop-color', d => colorScale(d * maxValue))

    legend.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#legend-gradient)')

    legend.append('g')
      .attr('transform', `translate(0, ${legendHeight})`)
      .call(legendAxis)
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
    a.download = `${data.title.replace(/\s+/g, "_")}_usa_map.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportJSON = () => {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.title.replace(/\s+/g, '_')}_usa_map.json`
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
