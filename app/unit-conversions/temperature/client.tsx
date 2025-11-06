"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"
import { Thermometer, ArrowUpDown } from "lucide-react"

const temperatureUnits = [
  { value: "celsius", label: "Celsius", abbreviation: "°C" },
  { value: "fahrenheit", label: "Fahrenheit", abbreviation: "°F" },
  { value: "kelvin", label: "Kelvin", abbreviation: "K" },
  { value: "rankine", label: "Rankine", abbreviation: "°R" },
]

export default function TemperatureConverterClient() {
  const [fromUnit, setFromUnit] = useState("celsius")
  const [toUnit, setToUnit] = useState("fahrenheit")
  const [fromValue, setFromValue] = useState("")
  const [toValue, setToValue] = useState("")

  const convertTemperature = (value: string, from: string, to: string) => {
    if (!value || isNaN(Number(value))) return ""
    
    const temp = Number(value)
    let celsius: number

    // Convert to Celsius first
    switch (from) {
      case "celsius":
        celsius = temp
        break
      case "fahrenheit":
        celsius = (temp - 32) * 5/9
        break
      case "kelvin":
        celsius = temp - 273.15
        break
      case "rankine":
        celsius = (temp - 491.67) * 5/9
        break
      default:
        return ""
    }

    // Convert from Celsius to target
    let result: number
    switch (to) {
      case "celsius":
        result = celsius
        break
      case "fahrenheit":
        result = celsius * 9/5 + 32
        break
      case "kelvin":
        result = celsius + 273.15
        break
      case "rankine":
        result = celsius * 9/5 + 491.67
        break
      default:
        return ""
    }

    return result.toFixed(2)
  }

  const handleFromValueChange = (value: string) => {
    setFromValue(value)
    setToValue(convertTemperature(value, fromUnit, toUnit))
  }

  const handleToValueChange = (value: string) => {
    setToValue(value)
    setFromValue(convertTemperature(value, toUnit, fromUnit))
  }

  const swapUnits = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    setFromValue(toValue)
    setToValue(fromValue)
  }

  const clearValues = () => {
    setFromValue("")
    setToValue("")
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Temperature Converter</h1>
            <p className="text-muted-foreground">
              Convert between Celsius, Fahrenheit, Kelvin, and Rankine
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                Temperature Conversion
              </CardTitle>
              <CardDescription>
                Convert between different temperature scales with precision
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="from-unit">From</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      id="from-value"
                      type="number"
                      placeholder="Enter temperature"
                      value={fromValue}
                      onChange={(e) => handleFromValueChange(e.target.value)}
                      className="flex-1"
                    />
                    <Select value={fromUnit} onValueChange={setFromUnit}>
                      <SelectTrigger className="sm:w-48">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {temperatureUnits.map((unit) => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label} ({unit.abbreviation})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-center md:mt-8">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={swapUnits}
                    className="rounded-full"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to-unit">To</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      id="to-value"
                      type="number"
                      placeholder="Result"
                      value={toValue}
                      onChange={(e) => handleToValueChange(e.target.value)}
                      className="flex-1"
                    />
                    <Select value={toUnit} onValueChange={setToUnit}>
                      <SelectTrigger className="sm:w-48">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {temperatureUnits.map((unit) => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label} ({unit.abbreviation})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={clearValues} className="flex-1">
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <FooterAd />

          <AboutDescription
            title="About Temperature Conversion"
            description="Temperature conversion is essential for science, cooking, weather, and international communication across different temperature scales."
            sections={[
              {
                title: "Temperature Scales",
                content: [
                  "Celsius (°C): Water freezes at 0°C, boils at 100°C - used worldwide",
                  "Fahrenheit (°F): Water freezes at 32°F, boils at 212°F - used in US",
                  "Kelvin (K): Absolute temperature scale starting at absolute zero (-273.15°C)",
                  "Rankine (°R): Absolute scale using Fahrenheit degrees, rarely used"
                ]
              },
              {
                title: "Conversion Formulas",
                content: [
                  "°F = (°C × 9/5) + 32",
                  "°C = (°F - 32) × 5/9",
                  "K = °C + 273.15",
                  "°R = °F + 459.67"
                ]
              },
              {
                title: "Common Reference Points",
                content: [
                  "Absolute Zero: -273.15°C = -459.67°F = 0K",
                  "Water Freezing: 0°C = 32°F = 273.15K",
                  "Room Temperature: ~20°C = ~68°F = ~293K",
                  "Body Temperature: 37°C = 98.6°F = 310K",
                  "Water Boiling: 100°C = 212°F = 373.15K"
                ]
              }
            ]}
          />
        </div>

        <div className="lg:col-span-1">
          <SidebarAd />
        </div>
      </div>
    </div>
  )
}