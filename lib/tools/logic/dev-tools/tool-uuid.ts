/**
 * UUID Generator Logic
 * Pure function for generating UUID v4
 */

export interface UUIDGenerateInput {
  count: number
}

export interface UUIDGenerateOutput {
  uuids: string[]
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export function generateUUIDs(input: UUIDGenerateInput): UUIDGenerateOutput {
  const count = Math.min(Math.max(1, input.count), 100)
  const uuids = Array.from({ length: count }, () => generateUUID())
  return { uuids }
}
