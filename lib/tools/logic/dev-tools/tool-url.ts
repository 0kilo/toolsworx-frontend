/**
 * URL Encoder/Decoder and Extractor Logic
 * Pure functions for URL encoding, decoding, and extraction
 */

export interface URLEncodeInput {
  text: string
}

export interface URLEncodeOutput {
  encoded: string
}

export interface URLDecodeOutput {
  decoded: string
}

export interface URLExtractInput {
  text: string
}

export interface URLExtractOutput {
  urls: string[]
}

export function encodeURL(input: URLEncodeInput): URLEncodeOutput {
  return { encoded: encodeURIComponent(input.text) }
}

export function decodeURL(input: URLEncodeInput): URLDecodeOutput {
  return { decoded: decodeURIComponent(input.text) }
}

export function extractURLs(input: URLExtractInput): URLExtractOutput {
  const urlRegex = /(https?:\/\/[^\s]+)|(ftp:\/\/[^\s]+)|(www\.[^\s]+\.[^\s]+)/gi
  const urls = input.text.match(urlRegex)
  
  if (urls && urls.length > 0) {
    const uniqueUrls = [...new Set(urls)].sort()
    return { urls: uniqueUrls }
  }
  
  return { urls: [] }
}
