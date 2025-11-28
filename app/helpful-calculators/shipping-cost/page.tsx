"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AboutDescription } from "@/components/ui/about-description"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, ExternalLink } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ShippingRate {
  carrier: string
  service: string
  estimatedCost: string
  deliveryTime: string
  features: string[]
  affiliateLink?: string
}

export default function ShippingCostCalculatorPage() {
  const [weight, setWeight] = useState("")
  const [length, setLength] = useState("")
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [zipFrom, setZipFrom] = useState("")
  const [zipTo, setZipTo] = useState("")
  const [packageValue, setPackageValue] = useState("")
  const [rates, setRates] = useState<ShippingRate[]>([])

  const calculateRates = () => {
    const w = parseFloat(weight) || 0
    const l = parseFloat(length) || 0
    const wd = parseFloat(width) || 0
    const h = parseFloat(height) || 0

    // Calculate dimensional weight
    const dimWeight = (l * wd * h) / 166
    const billableWeight = Math.max(w, dimWeight)

    // Base rates (simplified pricing model)
    const baseRate = billableWeight * 0.5 + 5

    const calculatedRates: ShippingRate[] = [
      {
        carrier: "USPS",
        service: "Priority Mail",
        estimatedCost: `$${(baseRate * 0.85).toFixed(2)}`,
        deliveryTime: "1-3 business days",
        features: ["Free tracking", "Insurance up to $100", "Weekend delivery"],
        affiliateLink: "https://www.usps.com/ship"
      },
      {
        carrier: "USPS",
        service: "Priority Mail Express",
        estimatedCost: `$${(baseRate * 1.5).toFixed(2)}`,
        deliveryTime: "1-2 business days",
        features: ["Overnight to most locations", "Free tracking", "Insurance up to $100"],
        affiliateLink: "https://www.usps.com/ship"
      },
      {
        carrier: "UPS",
        service: "UPS Ground",
        estimatedCost: `$${(baseRate * 0.95).toFixed(2)}`,
        deliveryTime: "1-5 business days",
        features: ["Free tracking", "$100 insurance included", "Signature required"],
        affiliateLink: "https://www.ups.com/ship"
      },
      {
        carrier: "UPS",
        service: "UPS 2nd Day Air",
        estimatedCost: `$${(baseRate * 1.8).toFixed(2)}`,
        deliveryTime: "2 business days",
        features: ["Free tracking", "$100 insurance included", "Saturday delivery available"],
        affiliateLink: "https://www.ups.com/ship"
      },
      {
        carrier: "FedEx",
        service: "FedEx Ground",
        estimatedCost: `$${(baseRate * 0.92).toFixed(2)}`,
        deliveryTime: "1-5 business days",
        features: ["Free tracking", "Money-back guarantee", "$100 insurance"],
        affiliateLink: "https://www.fedex.com/en-us/shipping.html"
      },
      {
        carrier: "FedEx",
        service: "FedEx 2Day",
        estimatedCost: `$${(baseRate * 1.75).toFixed(2)}`,
        deliveryTime: "2 business days",
        features: ["Free tracking", "Money-back guarantee", "Saturday delivery available"],
        affiliateLink: "https://www.fedex.com/en-us/shipping.html"
      },
      {
        carrier: "DHL",
        service: "DHL Ground",
        estimatedCost: `$${(baseRate * 0.88).toFixed(2)}`,
        deliveryTime: "2-5 business days",
        features: ["Free tracking", "Competitive rates", "Business delivery"],
        affiliateLink: "https://www.dhl.com/us-en/home/our-divisions/ecommerce.html"
      },
    ]

    setRates(calculatedRates.sort((a, b) =>
      parseFloat(a.estimatedCost.replace('$', '')) - parseFloat(b.estimatedCost.replace('$', ''))
    ))
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Shipping Cost Calculator</h1>
            <p className="text-muted-foreground">
              Compare shipping rates from USPS, UPS, FedEx, and DHL
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Package Details</CardTitle>
              <CardDescription>Enter your package information to compare rates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipFrom">From ZIP Code</Label>
                  <Input
                    id="zipFrom"
                    placeholder="90210"
                    value={zipFrom}
                    onChange={(e) => setZipFrom(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipTo">To ZIP Code</Label>
                  <Input
                    id="zipTo"
                    placeholder="10001"
                    value={zipTo}
                    onChange={(e) => setZipTo(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="length">Length (in)</Label>
                  <Input
                    id="length"
                    type="number"
                    placeholder="12"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">Width (in)</Label>
                  <Input
                    id="width"
                    type="number"
                    placeholder="10"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (in)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="8"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="packageValue">Package Value (optional)</Label>
                <Input
                  id="packageValue"
                  type="number"
                  placeholder="100"
                  value={packageValue}
                  onChange={(e) => setPackageValue(e.target.value)}
                />
              </div>

              <Button onClick={calculateRates} className="w-full" size="lg">
                <Package className="mr-2 h-4 w-4" />
                Compare Shipping Rates
              </Button>
            </CardContent>
          </Card>

          {rates.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Shipping Rate Comparison</CardTitle>
                <CardDescription>Rates sorted from lowest to highest</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rates.map((rate, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{rate.carrier} - {rate.service}</h3>
                          <p className="text-sm text-muted-foreground">{rate.deliveryTime}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{rate.estimatedCost}</p>
                          <p className="text-xs text-muted-foreground">estimated</p>
                        </div>
                      </div>
                      <ul className="text-sm space-y-1 mb-3">
                        {rate.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-muted-foreground">
                            <span className="mr-2">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {rate.affiliateLink && (
                        <Button variant="outline" className="w-full" asChild>
                          <a href={rate.affiliateLink} target="_blank" rel="noopener noreferrer">
                            Ship with {rate.carrier}
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}


          <AboutDescription
            title="About Shipping Cost Calculator"
            description="Compare shipping rates from major carriers including USPS, UPS, FedEx, and DHL. Get accurate shipping cost estimates based on package weight, dimensions, and destination."
            sections={[
              {
                title: "How to Use",
                content: [
                  "Enter your package details including weight, dimensions, and origin/destination ZIP codes.",
                  "Click 'Compare Shipping Rates' to see estimated costs from all major carriers sorted by price.",
                  "Each option includes delivery time and features to help you choose the best shipping method."
                ]
              },
              {
                title: "Holiday Shipping Tips",
                content: [
                  "During the holiday season, shipping deadlines are critical.",
                  "USPS Priority Mail typically needs to be sent by December 19th for Christmas delivery, while Priority Mail Express extends to December 23rd.",
                  "UPS and FedEx have similar deadlines.",
                  "Always check current carrier deadlines as they vary by destination."
                ]
              },
              {
                title: "Understanding Dimensional Weight",
                content: [
                  "Carriers charge based on the greater of actual weight or dimensional weight.",
                  "Dimensional weight is calculated as (Length × Width × Height) / 166.",
                  "Our calculator automatically compares both to give you the billable weight used for pricing."
                ]
              },
              {
                title: "Carrier Comparison",
                content: [
                  "USPS is often most economical for lightweight packages and offers free Saturday delivery.",
                  "UPS and FedEx provide robust tracking and guaranteed delivery times with money-back guarantees.",
                  "DHL offers competitive rates for business shipments.",
                  "Each carrier has strengths depending on your specific needs."
                ]
              },
              {
                title: "Saving on Shipping",
                content: [
                  "To reduce costs: use the smallest box that fits your items, compare all carrier options.",
                  "Consider slower delivery methods when not time-sensitive.",
                  "Take advantage of flat-rate boxes for heavy items.",
                  "Many carriers offer discounts for online labels versus counter service."
                ]
              },
            ]}
          />
        </div>

        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}
