import { NIL, MAX, parse, stringify, v1, v3, v4, v5, v6, v7 } from "uuid"

export type IdType =
  | "uuid-v1"
  | "uuid-v3"
  | "uuid-v4"
  | "uuid-v5"
  | "uuid-v6"
  | "uuid-v7"
  | "nil"
  | "max"
  | "api-key"
  | "short-id"
  | "parse"
  | "stringify"

export interface IdGenerateInput {
  count: number
  type: IdType
  namespace?: string
  name?: string
  prefix?: string
  uuidInput?: string
  bytesInput?: string
}

export interface IdGenerateOutput {
  ids: string[]
}

function randomBytes(length: number) {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return bytes
}

function base64Url(bytes: Uint8Array) {
  let binary = ""
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

function formatBytes(bytes: Uint8Array) {
  return Array.from(bytes).join(", ")
}

function parseBytesInput(input: string) {
  const trimmed = input.trim()
  if (!trimmed) return null
  const tokens = trimmed.split(/[\s,]+/).filter(Boolean)
  const bytes = tokens.map((token) => {
    const cleaned = token.toLowerCase()
    if (cleaned.startsWith("0x")) {
      return parseInt(cleaned.slice(2), 16)
    }
    if (/^[0-9a-f]{2}$/i.test(cleaned)) {
      return parseInt(cleaned, 16)
    }
    return parseInt(cleaned, 10)
  })
  if (bytes.some((value) => Number.isNaN(value))) {
    return null
  }
  if (bytes.length !== 16) {
    return null
  }
  return Uint8Array.from(bytes)
}

export async function generateIds(input: IdGenerateInput): Promise<IdGenerateOutput> {
  const count = Math.min(Math.max(1, input.count), 50)
  const type = input.type
  const ids: string[] = []

  if (type === "nil") {
    return { ids: [NIL] }
  }
  if (type === "max") {
    return { ids: [MAX] }
  }
  if (type === "parse") {
    const value = input.uuidInput?.trim()
    if (!value) {
      return { ids: [] }
    }
    const bytes = parse(value)
    return { ids: [formatBytes(bytes)] }
  }
  if (type === "stringify") {
    const bytes = parseBytesInput(input.bytesInput || "")
    if (!bytes) {
      return { ids: [] }
    }
    return { ids: [stringify(bytes)] }
  }

  for (let i = 0; i < count; i += 1) {
    if (type === "uuid-v1") {
      ids.push(v1())
      continue
    }
    if (type === "uuid-v3") {
      const namespace = input.namespace?.trim() || NIL
      const name = input.name?.trim() || "toolsworx"
      ids.push(v3(name, namespace))
      continue
    }
    if (type === "uuid-v4") {
      ids.push(v4())
      continue
    }
    if (type === "uuid-v5") {
      const namespace = input.namespace?.trim() || NIL
      const name = input.name?.trim() || "toolsworx"
      ids.push(v5(name, namespace))
      continue
    }
    if (type === "uuid-v6") {
      ids.push(v6())
      continue
    }
    if (type === "uuid-v7") {
      ids.push(v7())
      continue
    }
    if (type === "api-key") {
      const prefix = input.prefix?.trim() || "twx"
      ids.push(`${prefix}_${v4().replace(/-/g, "")}`)
      continue
    }
    const short = base64Url(randomBytes(16))
    ids.push(short)
  }

  return { ids }
}
