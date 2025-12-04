/**
 * CSV Formatter Logic
 * Pure functions for CSV parsing, formatting, and conversion
 */

export interface CSVFormatInput {
  csv: string
}

export interface CSVFormatOutput {
  formatted: string
}

export interface CSVToJSONOutput {
  json: string
}

export function parseCSVLine(line: string): string[] {
  const result = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current.trim())
  return result
}

export function formatCSV(input: CSVFormatInput): CSVFormatOutput {
  const lines = input.csv.trim().split('\n')
  const rows = lines.map(line => parseCSVLine(line))
  
  const maxWidths = rows.reduce((widths, row) => {
    row.forEach((cell, index) => {
      widths[index] = Math.max(widths[index] || 0, cell.length)
    })
    return widths
  }, [] as number[])

  const formatted = rows.map(row => 
    row.map((cell, index) => cell.padEnd(maxWidths[index] || 0)).join(' | ')
  ).join('\n')

  return { formatted }
}

export function csvToJSON(input: CSVFormatInput): CSVToJSONOutput {
  const lines = input.csv.trim().split('\n')
  
  if (lines.length < 2) {
    throw new Error('CSV must have at least a header row and one data row')
  }

  const headers = parseCSVLine(lines[0])
  const data = lines.slice(1).map(line => {
    const values = parseCSVLine(line)
    const obj: Record<string, string> = {}
    headers.forEach((header, index) => {
      obj[header] = values[index] || ''
    })
    return obj
  })

  return { json: JSON.stringify(data, null, 2) }
}
