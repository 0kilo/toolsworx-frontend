/**
 * Base64 Encoder/Decoder - Business Logic
 * 
 * Pure functions for Base64 encoding and decoding
 * MCP-compatible for AI agent integration
 * 
 * @module tools/logic/dev-tools/tool-base64
 */

export interface Base64Input {
  text: string
}

export interface Base64Output {
  result: string
}

export function validateBase64Input(input: Base64Input): string | null {
  if (!input.text || input.text.trim() === "") {
    return "Input text is required"
  }
  return null
}

export function encodeBase64(input: Base64Input): Base64Output {
  const error = validateBase64Input(input)
  if (error) throw new Error(error)

  try {
    const encoded = Buffer.from(input.text, 'utf-8').toString('base64')
    return { result: encoded }
  } catch (e: any) {
    throw new Error(`Encoding error: ${e.message}`)
  }
}

export function decodeBase64(input: Base64Input): Base64Output {
  const error = validateBase64Input(input)
  if (error) throw new Error(error)

  try {
    const decoded = Buffer.from(input.text, 'base64').toString('utf-8')
    return { result: decoded }
  } catch (e: any) {
    throw new Error(`Decoding error: ${e.message}`)
  }
}
