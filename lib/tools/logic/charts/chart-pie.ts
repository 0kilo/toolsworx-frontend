/**
 * Pie Chart - Business Logic
 * 
 * D3 rendering logic for pie charts
 * MCP-compatible for AI agent integration
 * 
 * @module tools/logic/charts/chart-pie
 */

import * as d3 from "d3"

export interface PieChartData {
  title: string
  data: Array<{ label: string; value: number; color?: string }>
}

export function validatePieChartData(data: PieChartData): string | null {
  if (!data.title) return "Title is required"
  if (!Array.isArray(data.data) || data.data.length === 0) return "Data must be a non-empty array"
  for (const point of data.data) {
    if (!point.label || typeof point.value !== "number") return "Each data point must have label and numeric value"
  }
  return null
}

export function renderPieChart(container: HTMLDivElement, data: PieChartData): void {
  d3.select(container).selectAll('*').remove()

  const width = 500
  const height = 400
  const radius = Math.min(width, height) / 2 - 40

  const svg = d3.select(container)
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
}

export function exportPieChartSVG(container: HTMLDivElement, title: string): void {
  const svg = container.querySelector('svg')
  if (!svg) return

  const serializer = new XMLSerializer()
  const svgString = serializer.serializeToString(svg)
  const blob = new Blob([svgString], { type: "image/svg+xml" })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement("a")
  a.href = url
  a.download = `${title.replace(/\s+/g, "_")}_pie_chart.svg`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportPieChartJSON(data: PieChartData): void {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `${data.title.replace(/\s+/g, '_')}_pie_chart.json`
  a.click()
  URL.revokeObjectURL(url)
}
