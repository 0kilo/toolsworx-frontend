/**
 * Packing List Optimizer Logic
 * Combines packing list generation with weight analysis
 */

export interface GearItem {
  name: string
  weightKg: number
  category: string
}

export interface PackingListResult {
  items: string[]
  totalWeightKg: number
  topHeavyItems: GearItem[]
  categoryBreakdown: Record<string, number>
}

export interface WeightAnalysisResult {
  totalKg: number
  topItems: GearItem[]
  categoryBreakdown: Record<string, number>
  ultralight: boolean
  lightweight: boolean
}

const PACKING_TEMPLATES: Record<string, Record<string, string[]>> = {
  travel: {
    essentials: ["Passport/ID", "Wallet", "Phone", "Charger", "Power bank", "Travel adapter"],
    clothing: ["Underwear", "Socks", "T-shirts", "Pants/shorts", "Light jacket", "Comfortable shoes"],
    toiletries: ["Toothbrush", "Toothpaste", "Deodorant", "Shampoo", "Medications"],
    extras: ["Sunglasses", "Book/tablet", "Snacks", "Water bottle"],
  },
  camping: {
    essentials: ["Tent", "Sleeping bag", "Sleeping pad", "Headlamp", "First aid kit", "Map/compass"],
    clothing: ["Moisture-wicking base layer", "Insulating layer", "Rain jacket", "Hiking boots", "Camp shoes"],
    cooking: ["Stove", "Fuel", "Pot/pan", "Utensils", "Water filter", "Food"],
    extras: ["Multi-tool", "Fire starter", "Rope/cord", "Trash bags"],
  },
  motorcycle: {
    essentials: ["Helmet", "License/insurance", "Tool kit", "Tire repair kit", "First aid kit"],
    clothing: ["Riding jacket", "Riding pants", "Gloves", "Boots", "Rain gear", "Base layers"],
    gear: ["Tank bag", "Saddlebags", "Bungee cords", "Phone mount", "Charger"],
    extras: ["Ear plugs", "Neck gaiter", "Sunscreen", "Hydration pack"],
  },
  backpacking: {
    essentials: ["Backpack", "Tent/hammock", "Sleeping bag", "Sleeping pad", "Water filter", "Navigation"],
    clothing: ["Base layer top/bottom", "Insulating layer", "Rain shell", "Hiking pants", "Trail runners"],
    cooking: ["Stove", "Fuel", "Pot", "Utensils", "Food", "Bear canister/bag"],
    extras: ["Trekking poles", "Headlamp", "Multi-tool", "First aid kit"],
  },
}

const WEATHER_ADDONS: Record<string, string[]> = {
  rain: ["Rain jacket", "Rain pants", "Pack cover", "Waterproof bags", "Quick-dry towel"],
  cold: ["Warm hat", "Gloves", "Neck gaiter", "Insulated jacket", "Hand warmers"],
  hot: ["Sun hat", "Sunscreen", "Lip balm", "Extra water", "Electrolytes", "Light clothing"],
}

export function generatePackingList(options: {
  tripType: "travel" | "camping" | "motorcycle" | "backpacking"
  days: number
  rainy: boolean
  tempC: number
}): PackingListResult {
  const template = PACKING_TEMPLATES[options.tripType]
  const items: string[] = []

  // Add template items
  Object.values(template).forEach((category) => {
    items.push(...category)
  })

  // Add weather-specific items
  if (options.rainy) {
    items.push(...WEATHER_ADDONS.rain)
  }
  if (options.tempC < 10) {
    items.push(...WEATHER_ADDONS.cold)
  }
  if (options.tempC > 25) {
    items.push(...WEATHER_ADDONS.hot)
  }

  // Add day-specific items
  const underwearCount = Math.min(options.days + 1, 7)
  items.push(`Extra underwear (${underwearCount} pairs)`)

  if (options.days > 3) {
    items.push("Laundry bag")
  }

  // Remove duplicates while preserving order
  const uniqueItems = Array.from(new Set(items))

  // Calculate estimated weight
  const weightEstimates: Record<string, number> = {
    "Tent": 1.8,
    "Sleeping bag": 1.2,
    "Sleeping pad": 0.5,
    "Backpack": 1.5,
    "Helmet": 1.4,
    "Rain jacket": 0.4,
    "Water filter": 0.3,
  }

  const gearItems: GearItem[] = uniqueItems.map((item) => {
    const baseName = item.split("(")[0].trim()
    return {
      name: item,
      weightKg: weightEstimates[baseName] || 0.2,
      category: getCategoryForItem(item, template),
    }
  })

  const totalWeight = gearItems.reduce((sum, item) => sum + item.weightKg, 0)
  const categoryBreakdown = categorizeItems(gearItems)
  const topHeavy = [...gearItems].sort((a, b) => b.weightKg - a.weightKg).slice(0, 5)

  return {
    items: uniqueItems,
    totalWeightKg: Math.round(totalWeight * 10) / 10,
    topHeavyItems: topHeavy,
    categoryBreakdown,
  }
}

export function analyzeBaseWeight(items: GearItem[]): WeightAnalysisResult {
  const total = items.reduce((sum, item) => sum + item.weightKg, 0)
  const topItems = [...items].sort((a, b) => b.weightKg - a.weightKg).slice(0, 5)
  const categoryBreakdown = categorizeItems(items)

  return {
    totalKg: Math.round(total * 10) / 10,
    topItems,
    categoryBreakdown,
    ultralight: total < 4.5,
    lightweight: total < 9,
  }
}

function getCategoryForItem(item: string, template: Record<string, string[]>): string {
  for (const [category, items] of Object.entries(template)) {
    if (items.some((i) => item.toLowerCase().includes(i.toLowerCase()))) {
      return category
    }
  }
  return "other"
}

function categorizeItems(items: GearItem[]): Record<string, number> {
  return items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.weightKg
    return acc
  }, {} as Record<string, number>)
}

export function parseGearItems(text: string): GearItem[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(",")
      const name = (parts[0] || "").trim()
      const weight = parseFloat((parts[1] || "0").trim())
      const category = (parts[2] || "other").trim()
      return { name, weightKg: isNaN(weight) ? 0 : weight, category }
    })
}
