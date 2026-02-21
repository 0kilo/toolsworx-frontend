import { ConverterMetadata } from "@/types/converter"
import { unitConversionTools as unitConversions } from "./categories/unit-conversions/registry"
import { calculatorTools as calculators } from "./categories/calculators/registry"
import { fileConverterTools as fileConverters } from "./categories/file-converters/registry"
import { mediaConverterTools as mediaConverters } from "./categories/media-converters/registry"
import { developerTools } from "./categories/developer-tools/registry"
import { filterTools as filters } from "./categories/filters/registry"
import { helpfulCalculators } from "./categories/helpful-calculators/registry"
import { chartTools } from "./categories/charts/registry"
import { adventureTools } from "./categories/adventure/registry"

// Combine all converters
export const allConverters: ConverterMetadata[] = [
  ...helpfulCalculators,
  ...unitConversions,
  ...calculators,
  ...fileConverters,
  ...mediaConverters,
  ...developerTools,
  ...filters,
  ...chartTools,
  ...adventureTools,
]

// Get converters by category
export function getConvertersByCategory(category: string): ConverterMetadata[] {
  return allConverters.filter((converter) => converter.category === category)
}

// Get converter by ID
export function getConverterById(id: string): ConverterMetadata | undefined {
  return allConverters.find((converter) => converter.id === id)
}

// Get popular converters
export function getPopularConverters(): ConverterMetadata[] {
  return allConverters.filter((converter) => converter.popular)
}

// Get featured converters
export function getFeaturedConverters(): ConverterMetadata[] {
  return allConverters.filter((converter) => (converter as any).featured)
}

// Search converters
export function searchConverters(query: string): ConverterMetadata[] {
  const lowercaseQuery = query.toLowerCase()
  return allConverters.filter(
    (converter) =>
      converter.title.toLowerCase().includes(lowercaseQuery) ||
      converter.description.toLowerCase().includes(lowercaseQuery) ||
      converter.keywords.some((keyword) =>
        keyword.toLowerCase().includes(lowercaseQuery)
      )
  )
}
