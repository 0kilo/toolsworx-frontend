/**
 * JSON Formatter - Business Logic
 * 
 * Pure functions for JSON formatting, validation, and minification
 * MCP-compatible for AI agent integration
 * 
 * @module tools/logic/dev-tools/tool-json
 */

export interface JSONInput {
  text: string
  indent?: number
}

export interface JSONOutput {
  result: string
  isValid?: boolean
}

export function validateJSONInput(input: JSONInput): string | null {
  if (!input.text || input.text.trim() === "") {
    return "Input JSON is required"
  }
  return null
}

export function formatJSON(input: JSONInput): JSONOutput {
  const error = validateJSONInput(input)
  if (error) throw new Error(error)

  try {
    const parsed = JSON.parse(input.text)
    const formatted = JSON.stringify(parsed, null, input.indent || 2)
    return { result: formatted, isValid: true }
  } catch (e: any) {
    throw new Error(`Invalid JSON: ${e.message}`)
  }
}

export function minifyJSON(input: JSONInput): JSONOutput {
  const error = validateJSONInput(input)
  if (error) throw new Error(error)

  try {
    const parsed = JSON.parse(input.text)
    const minified = JSON.stringify(parsed)
    return { result: minified, isValid: true }
  } catch (e: any) {
    throw new Error(`Invalid JSON: ${e.message}`)
  }
}

export function validateJSON(input: JSONInput): JSONOutput {
  const error = validateJSONInput(input)
  if (error) throw new Error(error)

  try {
    JSON.parse(input.text)
    return { result: "✓ Valid JSON", isValid: true }
  } catch (e: any) {
    throw new Error(`Invalid JSON: ${e.message}`)
  }
}
