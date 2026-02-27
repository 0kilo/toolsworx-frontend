import {
  Cloud,
  Shield,
  Route,
  FileText,
  Truck,
  DollarSign,
  Weight,
  Droplets,
  Gauge,
  Clock,
  ListChecks,
  Wallet,
  Calendar,
} from "lucide-react"
import { ConverterMetadata } from "@/types/converter"

/**
 * Adventure Registry
 * Tools for travelers, bikers, campers, backpackers, and motorcyclists.
 * Consolidated from 12 tools to 7 efficient tools.
 */
export const adventureTools: ConverterMetadata[] = [
  {
    id: "weather-window-risk-score",
    title: "Weather Window Risk Score",
    description: "Estimate trip weather risk for your selected window",
    category: "adventure",
    icon: Cloud,
    href: "/adventure/weather-window-risk-score",
    keywords: ["weather", "risk", "trip", "forecast", "planning"],
    popular: true,
  },
  {
    id: "emergency-info-card-generator",
    title: "Emergency Info Card Generator",
    description: "Generate a printable emergency contact card",
    category: "adventure",
    icon: Shield,
    href: "/adventure/emergency-info-card-generator",
    keywords: ["emergency", "contact", "medical", "card", "safety"],
    popular: true,
  },
  {
    id: "route-time-planner",
    title: "Route & Time Planner",
    description: "Plan route duration, fuel stops, and trip costs for driving, cycling, hiking, and motorcycle",
    category: "adventure",
    icon: Route,
    href: "/adventure/route-time-planner",
    keywords: ["route", "eta", "fuel", "cost", "trip planner", "pace", "range"],
    popular: true,
  },
  {
    id: "packing-list-optimizer",
    title: "Packing List Optimizer",
    description: "Build smart packing lists and optimize gear weight for any trip type",
    category: "adventure",
    icon: ListChecks,
    href: "/adventure/packing-list-optimizer",
    keywords: ["packing", "checklist", "gear weight", "travel", "backpacking", "ultralight"],
    popular: true,
  },
  {
    id: "trip-budget-planner",
    title: "Trip Budget Planner",
    description: "Plan trip budget with daily expenses and currency exchange buffer",
    category: "adventure",
    icon: Wallet,
    href: "/adventure/trip-budget-planner",
    keywords: ["travel budget", "currency", "trip cost", "expense planner"],
    popular: true,
  },
  {
    id: "water-food-planner",
    title: "Water & Food Planner",
    description: "Estimate daily water and food needs for the trip",
    category: "adventure",
    icon: Droplets,
    href: "/adventure/water-food-planner",
    keywords: ["camping", "water", "food", "ration", "planner"],
    popular: true,
  },
  {
    id: "ride-fueling-calculator",
    title: "Ride Fueling Calculator",
    description: "Estimate carb, fluid, and electrolyte targets for cycling",
    category: "adventure",
    icon: Gauge,
    href: "/adventure/ride-fueling-calculator",
    keywords: ["cycling", "fueling", "carbs", "hydration", "ride"],
    popular: true,
  },
]
