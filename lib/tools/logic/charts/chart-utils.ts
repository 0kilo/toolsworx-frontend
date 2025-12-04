/**
 * Chart Utilities - Business Logic
 * 
 * Shared utilities for chart data validation and export
 * MCP-compatible for AI agent integration
 * 
 * @module tools/logic/charts/chart-utils
 */

// Common chart data types
export interface ChartDataPoint {
  label?: string
  value: number
  color?: string
  x?: string | number
  y?: number
}

export interface ChartData {
  title: string
  data: ChartDataPoint[]
  color?: string
}

// Validation
export function validateChartData(data: ChartData): string | null {
  if (!data.title || typeof data.title !== "string") {
    return "Chart title is required"
  }
  if (!Array.isArray(data.data) || data.data.length === 0) {
    return "Chart data must be a non-empty array"
  }
  for (const point of data.data) {
    if (typeof point.value !== "number" || isNaN(point.value)) {
      return "All data points must have valid numeric values"
    }
  }
  return null
}

// Export utilities
export function exportToSVG(svgElement: SVGElement, filename: string): void {
  const serializer = new XMLSerializer()
  const svgString = serializer.serializeToString(svgElement)
  const blob = new Blob([svgString], { type: "image/svg+xml" })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function exportToJSON(data: any, filename: string): void {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function sanitizeFilename(title: string): string {
  return title.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "")
}
