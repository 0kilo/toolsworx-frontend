"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowLeftRight } from "lucide-react"
import { Unit } from "@/types/converter"
import {
  convertTemperature,
  convertDistance,
  convertWeight,
  convertVolume,
  convertTime
} from "@/lib/converters/formula-converters"

type ConversionType = "temperature" | "distance" | "weight" | "volume" | "time"

interface FormulaConverterProps {
  title: string
  description: string
  units: Unit[]
  defaultFromUnit: string
  defaultToUnit: string
  conversionType: ConversionType
  placeholder?: string
  resultLabel?: string
}

export function FormulaConverter({
  title,
  description,
  units,
  defaultFromUnit,
  defaultToUnit,
  conversionType,
  placeholder = "Enter value",
  resultLabel = "Result"
}: FormulaConverterProps) {
  const [inputValue, setInputValue] = useState("")
  const [fromUnit, setFromUnit] = useState(defaultFromUnit)
  const [toUnit, setToUnit] = useState(defaultToUnit)
  const [result, setResult] = useState<number | null>(null)

  const getConversionFunction = () => {
    switch (conversionType) {
      case "temperature":
        return convertTemperature
      case "distance":
        return convertDistance
      case "weight":
        return convertWeight
      case "volume":
        return convertVolume
      case "time":
        return convertTime
      default:
        return convertDistance
    }
  }

  const handleConvert = () => {
    const value = parseFloat(inputValue)
    if (isNaN(value)) {
      alert("Please enter a valid number")
      return
    }

    try {
      const conversionFn = getConversionFunction()
      const converted = conversionFn(value, fromUnit, toUnit)
      setResult(converted)
    } catch (error) {
      alert("Conversion error. Please try again.")
      console.error(error)
    }
  }

  const handleSwapUnits = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    if (result !== null) {
      setInputValue(result.toString())
      setResult(parseFloat(inputValue))
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Convert</CardTitle>
          <CardDescription>Enter a value and select units</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* From Section */}
          <div className="space-y-2">
            <Label htmlFor="from-value">From</Label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="from-value"
                type="number"
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConvert()}
              />
              <Select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                {units.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label} {unit.abbreviation && `(${unit.abbreviation})`}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwapUnits}
              className="rounded-full"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>

          {/* To Section */}
          <div className="space-y-2">
            <Label htmlFor="to-unit">To</Label>
            <Select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
              {units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label} {unit.abbreviation && `(${unit.abbreviation})`}
                </option>
              ))}
            </Select>
          </div>

          {/* Convert Button */}
          <Button onClick={handleConvert} className="w-full" size="lg">
            Convert
          </Button>

          {/* Result */}
          {result !== null && (
            <div className="bg-muted rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">{resultLabel}</p>
              <p className="text-4xl font-bold text-primary">
                {result.toFixed(4)}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {inputValue} {units.find(u => u.value === fromUnit)?.abbreviation || fromUnit} = {result.toFixed(4)} {units.find(u => u.value === toUnit)?.abbreviation || toUnit}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {units.slice(0, 4).map((unit) => (
              <div key={unit.value} className="flex items-center gap-2">
                <span className="font-medium">{unit.label}:</span>
                <span className="text-muted-foreground">{unit.abbreviation || unit.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
