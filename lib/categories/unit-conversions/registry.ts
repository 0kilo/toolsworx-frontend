import { Thermometer, Ruler, Weight, Droplet, Clock } from "lucide-react"
import { ConverterMetadata } from "@/types/converter"

/**
 * Unit Conversions Registry
 * All unit conversion tools are registered here
 */
export const unitConversionTools: ConverterMetadata[] = [
  // Temperature Conversions
  {
    id: "celsius-fahrenheit",
    title: "Celsius to Fahrenheit",
    description: "Convert temperature between Celsius and Fahrenheit",
    category: "temperature",
    icon: Thermometer,
    href: "/unit-conversions/celsius-fahrenheit",
    keywords: ["celsius", "fahrenheit", "temperature", "degrees", "c to f"],
    popular: true,
  },
  {
    id: "fahrenheit-celsius",
    title: "Fahrenheit to Celsius",
    description: "Convert temperature between Fahrenheit and Celsius",
    category: "temperature",
    icon: Thermometer,
    href: "/unit-conversions/fahrenheit-celsius",
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
    href: "/unit-conversions/km-miles",
    keywords: ["kilometers", "miles", "distance", "km", "mi"],
    popular: true,
  },
  {
    id: "miles-km",
    title: "Miles to Kilometers",
    description: "Convert distance between miles and kilometers",
    category: "distance",
    icon: Ruler,
    href: "/unit-conversions/miles-km",
    keywords: ["miles", "kilometers", "distance", "mi", "km"],
    popular: true,
  },
  {
    id: "feet-meters",
    title: "Feet to Meters",
    description: "Convert distance between feet and meters",
    category: "distance",
    icon: Ruler,
    href: "/unit-conversions/feet-meters",
    keywords: ["feet", "meters", "distance", "ft", "m"],
  },

  // Weight Conversions
  {
    id: "kg-lbs",
    title: "Kilograms to Pounds",
    description: "Convert weight between kilograms and pounds",
    category: "weight",
    icon: Weight,
    href: "/unit-conversions/kg-lbs",
    keywords: ["kilograms", "pounds", "weight", "kg", "lbs"],
    popular: true,
  },
  {
    id: "lbs-kg",
    title: "Pounds to Kilograms",
    description: "Convert weight between pounds and kilograms",
    category: "weight",
    icon: Weight,
    href: "/unit-conversions/lbs-kg",
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
    href: "/unit-conversions/liters-gallons",
    keywords: ["liters", "gallons", "volume", "l", "gal"],
  },

  // Time Conversions
  {
    id: "hours-minutes",
    title: "Hours to Minutes",
    description: "Convert time between hours and minutes",
    category: "time",
    icon: Clock,
    href: "/unit-conversions/hours-minutes",
    keywords: ["hours", "minutes", "time", "h", "min"],
  },
]
