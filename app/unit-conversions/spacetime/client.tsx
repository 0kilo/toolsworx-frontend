"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { AboutDescription } from "@/components/ui/about-description"
import { Orbit, ArrowUpDown } from "lucide-react"
import { convertSpaceTime } from "@/lib/categories/unit-conversions/logic"

const spaceTimeUnits = [
  { value: "m", label: "Meters", abbreviation: "m" },
  { value: "km", label: "Kilometers", abbreviation: "km" },
  { value: "AU", label: "Astronomical Units", abbreviation: "AU" },
  { value: "ly", label: "Light Years", abbreviation: "ly" },
  { value: "pc", label: "Parsecs", abbreviation: "pc" },
  { value: "kpc", label: "Kiloparsecs", abbreviation: "kpc" },
  { value: "Mpc", label: "Megaparsecs", abbreviation: "Mpc" },
  { value: "Gpc", label: "Gigaparsecs", abbreviation: "Gpc" },
  { value: "ls", label: "Light Seconds", abbreviation: "ls" },
  { value: "lm", label: "Light Minutes", abbreviation: "lm" },
  { value: "lh", label: "Light Hours", abbreviation: "lh" },
  { value: "ld", label: "Light Days", abbreviation: "ld" },
]

export default function SpaceTimeConverterClient() {
  const [fromUnit, setFromUnit] = useState("AU")
  const [toUnit, setToUnit] = useState("ly")
  const [fromValue, setFromValue] = useState("")
  const [toValue, setToValue] = useState("")

  const handleFromValueChange = (value: string) => {
    setFromValue(value)
    if (!value || isNaN(Number(value))) {
      setToValue("")
      return
    }
    
    try {
      const result = convertSpaceTime(Number(value), fromUnit, toUnit)
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
      const result = convertSpaceTime(Number(value), toUnit, fromUnit)
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
            <h1 className="text-3xl font-bold mb-2">Space-Time Converter</h1>
            <p className="text-muted-foreground">
              Convert between light-years, parsecs, astronomical units, and cosmic distances
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Orbit className="h-5 w-5" />
                Space-Time Distance Conversion
              </CardTitle>
              <CardDescription>
                Convert between astronomical and cosmic distance measurements
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
                      placeholder="Enter distance"
                      value={fromValue}
                      onChange={(e) => handleFromValueChange(e.target.value)}
                      className="flex-1"
                    />
                    <Select value={fromUnit} onValueChange={setFromUnit}>
                      <SelectTrigger className="sm:w-48">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {spaceTimeUnits.map((unit) => (
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
                        {spaceTimeUnits.map((unit) => (
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
            title="About Space-Time Distance Conversion"
            description="Astronomical distance measurements help us understand the vast scales of the universe, from our solar system to distant galaxies."
            sections={[
              {
                title: "Astronomical Distance Units",
                content: [
                  "Astronomical Unit (AU): Average Earth-Sun distance (~150 million km)",
                  "Light Year (ly): Distance light travels in one year (~9.46 trillion km)",
                  "Parsec (pc): Distance at which 1 AU subtends 1 arcsecond (~3.26 ly)",
                  "Light Second/Minute/Hour/Day: Distance light travels in that time",
                  "Kiloparsec (kpc): 1,000 parsecs, galactic scale distances",
                  "Megaparsec (Mpc): 1 million parsecs, intergalactic distances"
                ]
              },
              {
                title: "Scale References",
                content: [
                  "Earth to Moon: ~1.3 light seconds",
                  "Earth to Sun: 1 AU = 8.3 light minutes",
                  "Solar System diameter: ~100 AU",
                  "Nearest star (Proxima Centauri): 4.24 light years",
                  "Milky Way diameter: ~100,000 light years",
                  "Nearest galaxy (Andromeda): 2.5 million light years"
                ]
              },
              {
                title: "Applications",
                content: [
                  "Astronomy: Measuring stellar and galactic distances",
                  "Space missions: Navigation and trajectory planning",
                  "Cosmology: Understanding universe structure and expansion",
                  "Astrophysics: Calculating travel times for light and signals",
                  "Education: Teaching cosmic scale and perspective"
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