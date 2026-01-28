'use client'

const DEFAULT_ENV = process.env.NEXT_PUBLIC_API_KEY_ENV || 'live'

function base64Url(bytes: Uint8Array) {
  let binary = ''
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function randomId(byteLength: number) {
  const bytes = new Uint8Array(byteLength)
  crypto.getRandomValues(bytes)
  return base64Url(bytes)
}

export function generateApiKey() {
  const publicId =
    typeof crypto.randomUUID === 'function' ? crypto.randomUUID().replace(/-/g, '') : randomId(8)
  const secret =
    typeof crypto.randomUUID === 'function'
      ? `${crypto.randomUUID().replace(/-/g, '')}${crypto.randomUUID().replace(/-/g, '')}`
      : randomId(32)
  const key = `twx_${DEFAULT_ENV}_${publicId}.${secret}`
  const preview = `twx_${DEFAULT_ENV}_${publicId.slice(0, 4)}...${secret.slice(-4)}`
  return { publicId, secret, key, preview }
}

export async function hashSecret(secret: string) {
  const data = new TextEncoder().encode(secret)
  const digest = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(digest))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}
