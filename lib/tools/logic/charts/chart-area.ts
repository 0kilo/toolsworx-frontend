/**
 * Area Chart - Business Logic
 * 
 * D3 rendering logic for area charts
 * MCP-compatible for AI agent integration
 * 
 * @module tools/logic/charts/chart-area
 */

import * as d3 from "d3"

export interface AreaChartData {
  title: string
  data: Array<{ x: string | number; y: number }>
  color?: string
}

export function validateAreaChartData(data: AreaChartData): string | null {
  if (!data.title) return "Title is required"
  if (!Array.isArray(data.data) || data.data.length === 0) return "Data must be a non-empty array"
  for (const point of data.data) {
    if (point.x === undefined || point.y === undefined) return "Each data point must have x and y values"
    if (typeof point.y !== "number") return "Y values must be numbers"
  }
  return null
}

export function renderAreaChart(container: HTMLDivElement, data: AreaChartData): void {
  d3.select(container).selectAll('*').remove()

  const margin = { top: 20, right: 30, bottom: 40, left: 50 }
  const width = 600 - margin.left - margin.right
  const height = 400 - margin.top - margin.bottom

  const svg = d3.select(container)
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
}

export function exportAreaChartSVG(container: HTMLDivElement, title: string): void {
  const svg = container.querySelector('svg')
  if (!svg) return

  const serializer = new XMLSerializer()
  const svgString = serializer.serializeToString(svg)
  const blob = new Blob([svgString], { type: "image/svg+xml" })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement("a")
  a.href = url
  a.download = `${title.replace(/\s+/g, "_")}_area_chart.svg`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportAreaChartJSON(data: AreaChartData): void {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `${data.title.replace(/\s+/g, '_')}_area_chart.json`
  a.click()
  URL.revokeObjectURL(url)
}
