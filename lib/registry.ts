import { ConverterMetadata } from "@/types/converter"
import { unitConversionTools } from "./categories/unit-conversions/registry"
import { calculatorTools } from "./categories/calculators/registry"
import { fileConverterTools } from "./categories/file-converters/registry"
import { mediaConverterTools } from "./categories/media-converters/registry"
import { developerTools } from "./categories/developer-tools/registry"
import { filterTools } from "./categories/filters/registry"

/**
 * Master Registry
 * Central registry combining all converter tools from all categories
 */
export const converters: ConverterMetadata[] = [
  ...unitConversionTools,
  ...calculatorTools,
  ...fileConverterTools,
  ...mediaConverterTools,
  ...developerTools,
  ...filterTools,
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

// Export category-specific registries
export { unitConversionTools } from "./categories/unit-conversions/registry"
export { calculatorTools } from "./categories/calculators/registry"
export { fileConverterTools } from "./categories/file-converters/registry"
export { mediaConverterTools } from "./categories/media-converters/registry"
export { developerTools } from "./categories/developer-tools/registry"
export { filterTools } from "./categories/filters/registry"
