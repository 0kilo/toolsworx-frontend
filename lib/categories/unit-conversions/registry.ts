import { Thermometer, Ruler, Weight, Droplet, Clock, DollarSign, Gauge, Square } from "lucide-react"
import { ConverterMetadata } from "@/types/converter"

/**
 * Unit Conversions Registry
 * Consolidated bidirectional converters
 */
export const unitConversionTools: ConverterMetadata[] = [
  // Length/Distance
  {
    id: "inches-centimeters",
    title: "Inches - Centimeters",
    description: "**Convert between inches and centimeters instantly**",
    category: "distance",
    icon: Ruler,
    href: "/unit-conversions/inches-centimeters",
    keywords: ["inches", "centimeters", "length", "in", "cm"],
    popular: true,
  },
  {
    id: "feet-meters",
    title: "Feet - Meters",
    description: "**Convert between feet and meters with precision**",
    category: "distance",
    icon: Ruler,
    href: "/unit-conversions/feet-meters",
    keywords: ["feet", "meters", "length", "ft", "m"],
    popular: true,
  },

  // Weight/Mass
  {
    id: "pounds-kilograms",
    title: "Pounds - Kilograms",
    description: "**Convert between pounds and kilograms accurately**",
    category: "weight",
    icon: Weight,
    href: "/unit-conversions/pounds-kilograms",
    keywords: ["pounds", "kilograms", "weight", "lbs", "kg"],
    popular: true,
  },
  {
    id: "ounces-grams",
    title: "Ounces - Grams",
    description: "**Convert between ounces and grams for cooking and measurements**",
    category: "weight",
    icon: Weight,
    href: "/unit-conversions/ounces-grams",
    keywords: ["ounces", "grams", "weight", "oz", "g"],
    popular: true,
  },

  // Temperature
  {
    id: "celsius-fahrenheit",
    title: "Celsius - Fahrenheit",
    description: "**Convert between Celsius and Fahrenheit temperatures**",
    category: "temperature",
    icon: Thermometer,
    href: "/unit-conversions/celsius-fahrenheit",
    keywords: ["celsius", "fahrenheit", "temperature", "degrees", "c", "f"],
    popular: true,
  },
  {
    id: "kelvin-celsius",
    title: "Kelvin - Celsius",
    description: "**Convert between Kelvin and Celsius for scientific calculations**",
    category: "temperature",
    icon: Thermometer,
    href: "/unit-conversions/kelvin-celsius",
    keywords: ["kelvin", "celsius", "temperature", "k", "c", "scientific"],
    popular: true,
  },

  // Volume
  {
    id: "liters-gallons",
    title: "Liters - Gallons",
    description: "**Convert between liters and gallons for fuel and liquids**",
    category: "volume",
    icon: Droplet,
    href: "/unit-conversions/liters-gallons",
    keywords: ["liters", "gallons", "volume", "l", "gal"],
    popular: false,
  },
  {
    id: "milliliters-ounces",
    title: "Milliliters - Fluid Ounces",
    description: "**Convert between milliliters and fluid ounces for recipes**",
    category: "volume",
    icon: Droplet,
    href: "/unit-conversions/milliliters-ounces",
    keywords: ["milliliters", "fluid ounces", "volume", "ml", "fl oz"],
    popular: false,
  },

  // Currency
  {
    id: "usd-eur",
    title: "USD - EUR",
    description: "**Convert between US Dollars and Euros with live rates**",
    category: "currency",
    icon: DollarSign,
    href: "/unit-conversions/usd-eur",
    keywords: ["usd", "eur", "currency", "dollars", "euros", "exchange"],
    popular: false,
  },
  {
    id: "btc-usd",
    title: "BTC - USD",
    description: "**Convert between Bitcoin and US Dollars with real-time rates**",
    category: "currency",
    icon: DollarSign,
    href: "/unit-conversions/btc-usd",
    keywords: ["bitcoin", "btc", "usd", "cryptocurrency", "crypto"],
    popular: false,
  },

  // Time
  {
    id: "hours-seconds",
    title: "Hours - Seconds",
    description: "**Convert between hours and seconds for time calculations**",
    category: "time",
    icon: Clock,
    href: "/unit-conversions/hours-seconds",
    keywords: ["hours", "seconds", "time", "h", "s"],
    popular: false,
  },
  {
    id: "utc-timezone",
    title: "UTC - Local Timezone",
    description: "**Convert between UTC and local time zones worldwide**",
    category: "time",
    icon: Clock,
    href: "/unit-conversions/utc-timezone",
    keywords: ["utc", "timezone", "time", "local", "gmt"],
    popular: false,
  },

  // Speed
  {
    id: "mph-kmh",
    title: "MPH - km/h",
    description: "**Convert between miles per hour and kilometers per hour**",
    category: "speed",
    icon: Gauge,
    href: "/unit-conversions/mph-kmh",
    keywords: ["mph", "kmh", "speed", "miles per hour", "kilometers per hour"],
    popular: false,
  },
  {
    id: "knots-ms",
    title: "Knots - m/s",
    description: "**Convert between knots and meters per second for navigation**",
    category: "speed",
    icon: Gauge,
    href: "/unit-conversions/knots-ms",
    keywords: ["knots", "meters per second", "speed", "nautical", "m/s"],
    popular: false,
  },

  // Area
  {
    id: "sqft-sqm",
    title: "Square Feet - Square Meters",
    description: "**Convert between square feet and square meters for area**",
    category: "area",
    icon: Square,
    href: "/unit-conversions/sqft-sqm",
    keywords: ["square feet", "square meters", "area", "sqft", "sqm"],
    popular: false,
  },
  {
    id: "acres-hectares",
    title: "Acres - Hectares",
    description: "**Convert between acres and hectares for land measurement**",
    category: "area",
    icon: Square,
    href: "/unit-conversions/acres-hectares",
    keywords: ["acres", "hectares", "area", "land", "property"],
    popular: false,
  },
]
