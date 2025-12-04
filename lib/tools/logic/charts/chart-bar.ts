/**
 * Bar Chart - Business Logic
 * 
 * D3 rendering logic for bar charts
 * MCP-compatible for AI agent integration
 * 
 * @module tools/logic/charts/chart-bar
 */

import * as d3 from "d3"

export interface BarChartData {
  title: string
  data: Array<{ label: string; value: number; color?: string }>
}

export function validateBarChartData(data: BarChartData): string | null {
  if (!data.title) return "Title is required"
  if (!Array.isArray(data.data) || data.data.length === 0) return "Data must be a non-empty array"
  for (const point of data.data) {
    if (!point.label || typeof point.value !== "number") return "Each data point must have label and numeric value"
  }
  return null
}

export function renderBarChart(container: HTMLDivElement, data: BarChartData): void {
  d3.select(container).selectAll('*').remove()

  const margin = { top: 20, right: 30, bottom: 40, left: 40 }
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
    .domain(data.data.map(d => d.label))

  const y = d3.scaleLinear()
    .rangeRound([height, 0])
    .domain([0, d3.max(data.data, d => d.value) || 0])

  g.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))

  g.append('g')
    .call(d3.axisLeft(y))

  g.selectAll('.bar')
    .data(data.data)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d.label) || 0)
    .attr('y', d => y(d.value))
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(d.value))
    .attr('fill', d => d.color || '#3b82f6')

  g.selectAll('.value-label')
    .data(data.data)
    .enter().append('text')
    .attr('class', 'value-label')
    .attr('x', d => (x(d.label) || 0) + x.bandwidth() / 2)
    .attr('y', d => y(d.value) - 5)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .text(d => d.value)
}

export function exportBarChartSVG(container: HTMLDivElement, title: string): void {
  const svg = container.querySelector('svg')
  if (!svg) return

  const serializer = new XMLSerializer()
  const svgString = serializer.serializeToString(svg)
  const blob = new Blob([svgString], { type: "image/svg+xml" })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement("a")
  a.href = url
  a.download = `${title.replace(/\s+/g, "_")}_bar_chart.svg`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportBarChartJSON(data: BarChartData): void {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `${data.title.replace(/\s+/g, '_')}_bar_chart.json`
  a.click()
  URL.revokeObjectURL(url)
}
