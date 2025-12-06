"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { AboutDescription } from "@/components/ui/about-description"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Thermometer, ArrowUpDown } from "lucide-react"
import { convertTemperature } from "@/lib/tools/logic/unit-conversions/temperature"
import toolContent from "./temperature.json"

export default function TemperatureConverterClient() {
  const [fromUnit, setFromUnit] = useState(toolContent.defaultFromUnit)
  const [toUnit, setToUnit] = useState(toolContent.defaultToUnit)
  const [fromValue, setFromValue] = useState("")
  const [toValue, setToValue] = useState("")

  const handleConvert = (value: string, from: string, to: string) => {
    if (!value || isNaN(Number(value))) return ""
    
    try {
      const result = convertTemperature({ value: Number(value), fromUnit: from, toUnit: to })
      return result.result.toFixed(2)
    } catch (error) {
      return ""
    }
  }

  const handleFromValueChange = (value: string) => {
    setFromValue(value)
    setToValue(handleConvert(value, fromUnit, toUnit))
  }

  const handleToValueChange = (value: string) => {
    setToValue(value)
    setFromValue(handleConvert(value, toUnit, fromUnit))
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
      <Breadcrumb
        items={[
          { label: "Unit Conversions", href: "/category/unit-conversions" },
          { label: "Temperature Converter", href: "/unit-conversions/temperature" },
        ]}
      />
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
                        {toolContent.units.map((unit) => (
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
                        {toolContent.units.map((unit) => (
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

          <AboutDescription
            title={`About ${toolContent.title}`}
            description={toolContent.description}
            sections={toolContent.sections}
          />
        </div>

        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}
