import { LucideIcon } from "lucide-react"

export type ConverterCategory =
  | "temperature"
  | "distance"
  | "weight"
  | "volume"
  | "time"
  | "document"
  | "image"
  | "video"
  | "audio"
  | "other"

export interface ConverterMetadata {
  id: string
  title: string
  description: string
  category: ConverterCategory
  icon: LucideIcon
  href: string
  keywords: string[]
  popular?: boolean
}

export interface Unit {
  value: string
  label: string
  abbreviation?: string
}

export interface FormulaConverterConfig {
  units: Unit[]
  defaultFrom: string
  defaultTo: string
  conversionFunction: (value: number, from: string, to: string) => number | string
}

export interface FileConverterConfig {
  acceptedFormats: string[]
  maxFileSize: number
  outputFormats: string[]
}
