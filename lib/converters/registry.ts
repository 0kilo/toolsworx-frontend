import {
  Thermometer,
  Ruler,
  Weight,
  Droplet,
  Clock,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Calculator
} from "lucide-react"
import { ConverterMetadata } from "@/types/converter"

/**
 * Central registry of all converters
 * Add new converters here to automatically include them in the homepage
 */
export const converters: ConverterMetadata[] = [
  // Temperature Conversions
  {
    id: "celsius-fahrenheit",
    title: "Celsius to Fahrenheit",
    description: "Convert temperature between Celsius and Fahrenheit",
    category: "temperature",
    icon: Thermometer,
    href: "/convert/celsius-fahrenheit",
    keywords: ["celsius", "fahrenheit", "temperature", "degrees", "c to f"],
    popular: true,
  },
  {
    id: "fahrenheit-celsius",
    title: "Fahrenheit to Celsius",
    description: "Convert temperature between Fahrenheit and Celsius",
    category: "temperature",
    icon: Thermometer,
    href: "/convert/fahrenheit-celsius",
    keywords: ["fahrenheit", "celsius", "temperature", "degrees", "f to c"],
    popular: true,
  },

  // Distance Conversions
  {
    id: "km-miles",
    title: "Kilometers to Miles",
    description: "Convert distance between kilometers and miles",
    category: "distance",
    icon: Ruler,
    href: "/convert/km-miles",
    keywords: ["kilometers", "miles", "distance", "km", "mi"],
    popular: true,
  },
  {
    id: "miles-km",
    title: "Miles to Kilometers",
    description: "Convert distance between miles and kilometers",
    category: "distance",
    icon: Ruler,
    href: "/convert/miles-km",
    keywords: ["miles", "kilometers", "distance", "mi", "km"],
    popular: true,
  },
  {
    id: "feet-meters",
    title: "Feet to Meters",
    description: "Convert distance between feet and meters",
    category: "distance",
    icon: Ruler,
    href: "/convert/feet-meters",
    keywords: ["feet", "meters", "distance", "ft", "m"],
  },

  // Weight Conversions
  {
    id: "kg-lbs",
    title: "Kilograms to Pounds",
    description: "Convert weight between kilograms and pounds",
    category: "weight",
    icon: Weight,
    href: "/convert/kg-lbs",
    keywords: ["kilograms", "pounds", "weight", "kg", "lbs"],
    popular: true,
  },
  {
    id: "lbs-kg",
    title: "Pounds to Kilograms",
    description: "Convert weight between pounds and kilograms",
    category: "weight",
    icon: Weight,
    href: "/convert/lbs-kg",
    keywords: ["pounds", "kilograms", "weight", "lbs", "kg"],
    popular: true,
  },

  // Volume Conversions
  {
    id: "liters-gallons",
    title: "Liters to Gallons",
    description: "Convert volume between liters and gallons",
    category: "volume",
    icon: Droplet,
    href: "/convert/liters-gallons",
    keywords: ["liters", "gallons", "volume", "l", "gal"],
  },

  // Time Conversions
  {
    id: "hours-minutes",
    title: "Hours to Minutes",
    description: "Convert time between hours and minutes",
    category: "time",
    icon: Clock,
    href: "/convert/hours-minutes",
    keywords: ["hours", "minutes", "time", "h", "min"],
  },

  // Document Conversions (placeholders for future implementation)
  {
    id: "pdf-word",
    title: "PDF to Word",
    description: "Convert PDF documents to Word format",
    category: "document",
    icon: FileText,
    href: "/convert/pdf-word",
    keywords: ["pdf", "word", "docx", "document"],
    popular: true,
  },

  // Image Conversions
  {
    id: "image-converter",
    title: "Image Format Converter",
    description: "Convert images between JPG, PNG, WEBP and other formats",
    category: "image",
    icon: ImageIcon,
    href: "/convert/image-converter",
    keywords: ["image", "jpg", "png", "webp", "photo"],
    popular: true,
  },
]

/**
 * Get converters by category
 */
export function getConvertersByCategory(category: ConverterMetadata["category"]) {
  return converters.filter((c) => c.category === category)
}

/**
 * Get popular converters
 */
export function getPopularConverters() {
  return converters.filter((c) => c.popular)
}

/**
 * Get converter by ID
 */
export function getConverterById(id: string) {
  return converters.find((c) => c.id === id)
}

/**
 * Search converters
 */
export function searchConverters(query: string) {
  const lowerQuery = query.toLowerCase()
  return converters.filter(
    (c) =>
      c.title.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery) ||
      c.keywords.some((k) => k.includes(lowerQuery))
  )
}
