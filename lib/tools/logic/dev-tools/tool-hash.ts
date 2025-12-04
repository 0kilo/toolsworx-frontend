/**
 * Hash Generator - Business Logic
 * 
 * Pure functions for generating cryptographic hashes
 * MCP-compatible for AI agent integration
 * 
 * @module tools/logic/dev-tools/tool-hash
 */

export interface HashInput {
  text: string
  algorithm: "md5" | "sha1" | "sha256" | "base64"
}

export interface HashOutput {
  hash: string
}

export function validateHashInput(input: HashInput): string | null {
  if (!input.text) {
    return "Input text is required"
  }
  if (!["md5", "sha1", "sha256", "base64"].includes(input.algorithm)) {
    return "Invalid algorithm"
  }
  return null
}

export async function generateHash(input: HashInput): Promise<HashOutput> {
  const error = validateHashInput(input)
  if (error) throw new Error(error)

  try {
    let result = ""
    
    if (input.algorithm === "base64") {
      result = btoa(input.text)
    } else {
      const algorithmMap: Record<string, string> = {
        md5: "MD5",
        sha1: "SHA-1",
        sha256: "SHA-256"
      }
      result = await cryptoHash(input.text, algorithmMap[input.algorithm])
    }
    
    return { hash: result }
  } catch (e: any) {
    throw new Error(`Hash generation error: ${e.message}`)
  }
}

async function cryptoHash(text: string, algorithm: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export function generateRandomString(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
