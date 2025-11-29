import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Gift, Scale, Truck } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Helpful Calculators Cheatsheet - Quick Reference Guide",
  description: "Complete reference guide for all helpful calculators including holiday countdown, recipe scaler, secret santa generator, and shipping cost calculator.",
  keywords: ["calculator cheatsheet", "helpful tools", "holiday calculator", "recipe scaler", "secret santa", "shipping calculator"],
}

const calculators = [
  {
    id: "holiday-countdown",
    title: "Holiday Countdown",
    description: "Count days until holidays and special events",
    icon: Calendar,
    features: ["Real-time countdown", "Multiple holidays", "Custom events", "Time zones"],
    useCases: ["Event planning", "Holiday preparation", "Project deadlines", "Special occasions"],
    href: "/helpful-calculators/holiday-countdown"
  },
  {
    id: "recipe-scaler",
    title: "Recipe Scaler",
    description: "Scale recipe ingredients up or down",
    icon: Scale,
    features: ["Ingredient scaling", "Serving adjustments", "Unit conversions", "Fraction handling"],
    useCases: ["Cooking for groups", "Meal prep", "Baking adjustments", "Portion control"],
    href: "/helpful-calculators/recipe-scaler"
  },
  {
    id: "secret-santa",
    title: "Secret Santa Generator",
    description: "Generate random gift exchange assignments",
    icon: Gift,
    features: ["Random matching", "Exclusion rules", "Email notifications", "Group management"],
    useCases: ["Office parties", "Family gatherings", "Friend groups", "Holiday exchanges"],
    href: "/helpful-calculators/secret-santa"
  },
  {
    id: "shipping-cost",
    title: "Shipping Cost Calculator",
    description: "Calculate shipping costs for packages",
    icon: Truck,
    features: ["Multiple carriers", "Weight/size pricing", "Zone calculations", "Service options"],
    useCases: ["E-commerce", "Package sending", "Cost comparison", "Shipping planning"],
    href: "/helpful-calculators/shipping-cost"
  }
]

export default function HelpfulCalculatorsCheatsheet() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Helpful Calculators Cheatsheet</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Quick reference guide for all helpful calculators and utility tools. Perfect for everyday tasks and special occasions.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {calculators.map((calc) => {
          const IconComponent = calc.icon
          return (
            <Card key={calc.id} className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <IconComponent className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-xl">{calc.title}</CardTitle>
                    <CardDescription>{calc.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Key Features</h4>
                  <div className="flex flex-wrap gap-1">
                    {calc.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Common Use Cases</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {calc.useCases.map((useCase) => (
                      <li key={useCase} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-primary rounded-full"></span>
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link 
                  href={calc.href}
                  className="inline-flex items-center text-primary hover:underline font-medium"
                >
                  Try {calc.title} →
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-12 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-left space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <h4 className="font-semibold text-sm">Holiday Countdown</h4>
                <p className="text-sm text-muted-foreground">Set custom events and get notifications</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Recipe Scaler</h4>
                <p className="text-sm text-muted-foreground">Handles fractions and mixed units automatically</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Secret Santa</h4>
                <p className="text-sm text-muted-foreground">Add exclusion rules for couples or families</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Shipping Cost</h4>
                <p className="text-sm text-muted-foreground">Compare rates across multiple carriers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}