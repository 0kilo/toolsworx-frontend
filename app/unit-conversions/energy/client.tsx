"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { AboutDescription } from "@/components/ui/about-description"
import { Zap, ArrowUpDown } from "lucide-react"
import { convertEnergy } from "@/lib/categories/unit-conversions/logic"

const energyUnits = [
  { value: "J", label: "Joules", abbreviation: "J" },
  { value: "kJ", label: "Kilojoules", abbreviation: "kJ" },
  { value: "cal", label: "Calories", abbreviation: "cal" },
  { value: "kcal", label: "Kilocalories", abbreviation: "kcal" },
  { value: "Wh", label: "Watt Hours", abbreviation: "Wh" },
  { value: "kWh", label: "Kilowatt Hours", abbreviation: "kWh" },
  { value: "BTU", label: "British Thermal Units", abbreviation: "BTU" },
  { value: "eV", label: "Electron Volts", abbreviation: "eV" },
  { value: "keV", label: "Kiloelectron Volts", abbreviation: "keV" },
  { value: "MeV", label: "Megaelectron Volts", abbreviation: "MeV" },
  { value: "GeV", label: "Gigaelectron Volts", abbreviation: "GeV" },
  { value: "ft-lbf", label: "Foot-Pounds Force", abbreviation: "ft·lbf" },
]

export default function EnergyConverterClient() {
  const [fromUnit, setFromUnit] = useState("J")
  const [toUnit, setToUnit] = useState("cal")
  const [fromValue, setFromValue] = useState("")
  const [toValue, setToValue] = useState("")

  const handleFromValueChange = (value: string) => {
    setFromValue(value)
    if (!value || isNaN(Number(value))) {
      setToValue("")
      return
    }
    
    try {
      const result = convertEnergy(Number(value), fromUnit, toUnit)
      setToValue(result.toExponential(6))
    } catch (error) {
      setToValue("Error")
    }
  }

  const handleToValueChange = (value: string) => {
    setToValue(value)
    if (!value || isNaN(Number(value))) {
      setFromValue("")
      return
    }
    
    try {
      const result = convertEnergy(Number(value), toUnit, fromUnit)
      setFromValue(result.toExponential(6))
    } catch (error) {
      setFromValue("Error")
    }
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
            <h1 className="text-3xl font-bold mb-2">Energy Converter</h1>
            <p className="text-muted-foreground">
              Convert between joules, calories, BTU, kilowatt hours, and electron volts
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Energy Conversion
              </CardTitle>
              <CardDescription>
                Convert between different energy units with scientific precision
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
                      placeholder="Enter energy value"
                      value={fromValue}
                      onChange={(e) => handleFromValueChange(e.target.value)}
                      className="flex-1"
                    />
                    <Select value={fromUnit} onValueChange={setFromUnit}>
                      <SelectTrigger className="sm:w-48">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {energyUnits.map((unit) => (
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
                        {energyUnits.map((unit) => (
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
            title="About Energy Conversion"
            description="Energy conversion is fundamental in physics, engineering, and everyday applications from nutrition to power generation."
            sections={[
              {
                title: "Common Energy Units",
                content: [
                  "Joule (J): SI base unit of energy, work, and heat",
                  "Calorie (cal): Energy to heat 1g water by 1°C (4.184 J)",
                  "Kilocalorie (kcal): Food calories, 1000 calories",
                  "BTU: British Thermal Unit, energy to heat 1 lb water by 1°F",
                  "kWh: Kilowatt hour, electrical energy unit (3.6 MJ)",
                  "Electron Volt (eV): Energy of electron accelerated by 1 volt"
                ]
              },
              {
                title: "Energy Equivalents",
                content: [
                  "1 kWh = 3,600,000 J = 860,421 cal",
                  "1 BTU = 1,055 J = 252 cal",
                  "1 kcal = 4,184 J = 1.163 Wh",
                  "1 eV = 1.602 × 10⁻¹⁹ J",
                  "1 GeV = 1.602 × 10⁻¹⁰ J"
                ]
              },
              {
                title: "Applications",
                content: [
                  "Nutrition: Food energy in calories/kcal",
                  "Physics: Particle energies in electron volts",
                  "Engineering: Mechanical work in joules",
                  "Utilities: Electrical consumption in kWh",
                  "HVAC: Heating/cooling capacity in BTU"
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