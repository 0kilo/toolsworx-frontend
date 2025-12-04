/**
 * JWT Decoder Logic
 * Pure function for decoding JWT tokens (no signature verification)
 */

export interface JWTDecodeInput {
  token: string
}

export interface JWTDecodeOutput {
  header: any
  payload: any
  signature: string
  note: string
}

export function decodeJWT(input: JWTDecodeInput): JWTDecodeOutput {
  const parts = input.token.trim().split('.')
  
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format. JWT should have 3 parts separated by dots.')
  }

  const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')))
  const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
  
  return {
    header,
    payload,
    signature: parts[2],
    note: '⚠️ This is decode-only. Signature verification requires server-side validation.'
  }
}
