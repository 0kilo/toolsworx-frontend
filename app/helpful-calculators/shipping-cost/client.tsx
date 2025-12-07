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
import { calculateShippingRates, type ShippingRate } from "@/lib/tools/logic/helpful-calculators/helper-shipping"
import toolContent from "./shipping-cost.json"

export default function ShippingcostClient() {
  const [weight, setWeight] = useState("")
  const [length, setLength] = useState("")
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [zipFrom, setZipFrom] = useState("")
  const [zipTo, setZipTo] = useState("")
  const [packageValue, setPackageValue] = useState("")
  const [rates, setRates] = useState<ShippingRate[]>([])

  const handleCalculate = () => {
    const result = calculateShippingRates({
      weight: parseFloat(weight) || 0,
      length: parseFloat(length) || 0,
      width: parseFloat(width) || 0,
      height: parseFloat(height) || 0
    })
    setRates(result.rates)
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{toolContent.pageTitle}</h1>
            <p className="text-muted-foreground">
              {toolContent.pageDescription}
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

              <Button onClick={handleCalculate} className="w-full" size="lg">
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
            title={toolContent.aboutTitle}
            description={toolContent.aboutDescription}
            sections={toolContent.sections}
          />
        </div>

        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}
