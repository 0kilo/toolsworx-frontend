/**
 * Scatter Chart - Business Logic
 * 
 * D3 rendering logic for scatter charts
 * MCP-compatible for AI agent integration
 * 
 * @module tools/logic/charts/chart-scatter
 */

import * as d3 from "d3"

export interface ScatterChartData {
  title: string
  data: Array<{ x: number; y: number; label?: string; color?: string }>
}

export function validateScatterChartData(data: ScatterChartData): string | null {
  if (!data.title) return "Title is required"
  if (!Array.isArray(data.data) || data.data.length === 0) return "Data must be a non-empty array"
  for (const point of data.data) {
    if (typeof point.x !== "number" || typeof point.y !== "number") return "Each data point must have numeric x and y values"
  }
  return null
}

export function renderScatterChart(container: HTMLDivElement, data: ScatterChartData): void {
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
}

export function exportScatterChartSVG(container: HTMLDivElement, title: string): void {
  const svg = container.querySelector('svg')
  if (!svg) return

  const serializer = new XMLSerializer()
  const svgString = serializer.serializeToString(svg)
  const blob = new Blob([svgString], { type: "image/svg+xml" })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement("a")
  a.href = url
  a.download = `${title.replace(/\s+/g, "_")}_scatter_chart.svg`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportScatterChartJSON(data: ScatterChartData): void {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `${data.title.replace(/\s+/g, '_')}_scatter_chart.json`
  a.click()
  URL.revokeObjectURL(url)
}
