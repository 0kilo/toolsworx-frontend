"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { AboutDescription } from "@/components/ui/about-description"
import { Ruler, ArrowUpDown } from "lucide-react"

const units = [
  { value: "unit1", label: "Unit 1", abbreviation: "u1" },
  { value: "unit2", label: "Unit 2", abbreviation: "u2" },
]

export default function TemplateConverterPage() {
  const [fromUnit, setFromUnit] = useState("unit1")
  const [toUnit, setToUnit] = useState("unit2")
  const [fromValue, setFromValue] = useState("")
  const [toValue, setToValue] = useState("")

  const convertValue = (value: string, from: string, to: string) => {
    if (!value || isNaN(Number(value))) return ""
    
    const num = Number(value)
    // Template conversion logic
    const result = num * 1 // Replace with actual conversion
    return result.toFixed(2)
  }

  const handleFromValueChange = (value: string) => {
    setFromValue(value)
    setToValue(convertValue(value, fromUnit, toUnit))
  }

  const handleToValueChange = (value: string) => {
    setToValue(value)
    setFromValue(convertValue(value, toUnit, fromUnit))
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
            <h1 className="text-3xl font-bold mb-2">Template Converter</h1>
            <p className="text-muted-foreground">
              Convert between different units
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5" />
                Unit Conversion
              </CardTitle>
              <CardDescription>
                Convert between different units with precision
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
                      placeholder="Enter value"
                      value={fromValue}
                      onChange={(e) => handleFromValueChange(e.target.value)}
                      className="flex-1"
                    />
                    <Select value={fromUnit} onValueChange={setFromUnit}>
                      <SelectTrigger className="sm:w-48">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
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
                        {units.map((unit) => (
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
            title="About Template Conversion"
            description="Template description for unit conversion functionality."
            sections={[
              {
                title: "Supported Units",
                content: [
                  "Unit 1 - Description",
                  "Unit 2 - Description"
                ]
              },
              {
                title: "Conversion Formulas",
                content: [
                  "Formula 1",
                  "Formula 2"
                ]
              }
            ]}
          />
        </div>

        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}