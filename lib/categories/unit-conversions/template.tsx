"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowLeftRight, Copy, RotateCcw, Check } from "lucide-react"
import { Unit } from "@/types/converter"
import {
  convertTemperature,
  convertDistance,
  convertWeight,
  convertVolume,
  convertTime
} from "./logic"

type ConversionType = "temperature" | "distance" | "weight" | "volume" | "time"

interface UnitConversionTemplateProps {
  title: string
  description: string
  units: Unit[]
  defaultFromUnit: string
  defaultToUnit: string
  conversionType: ConversionType
  placeholder?: string
  resultLabel?: string
}

/**
 * Unit Conversion Template
 *
 * Use this template for converting between units of measurement.
 * Supports: temperature, distance, weight, volume, time
 *
 * @example
 * ```tsx
 * <UnitConversionTemplate
 *   title="Temperature Converter"
 *   description="Convert between Celsius and Fahrenheit"
 *   units={temperatureUnits}
 *   defaultFromUnit="celsius"
 *   defaultToUnit="fahrenheit"
 *   conversionType="temperature"
 * />
 * ```
 */
export function UnitConversionTemplate({
  title,
  description,
  units,
  defaultFromUnit,
  defaultToUnit,
  conversionType,
  placeholder = "Enter value",
  resultLabel = "Result"
}: UnitConversionTemplateProps) {
  const [inputValue, setInputValue] = useState("")
  const [fromUnit, setFromUnit] = useState(defaultFromUnit)
  const [toUnit, setToUnit] = useState(defaultToUnit)
  const [result, setResult] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

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

  const handleCopy = async () => {
    if (result === null) return

    const fromAbbr = units.find(u => u.value === fromUnit)?.abbreviation || fromUnit
    const toAbbr = units.find(u => u.value === toUnit)?.abbreviation || toUnit
    const textToCopy = `${inputValue} ${fromAbbr} = ${result.toFixed(4)} ${toAbbr}`

    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleClear = () => {
    setInputValue("")
    setFromUnit(defaultFromUnit)
    setToUnit(defaultToUnit)
    setResult(null)
    setCopied(false)
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
            <div className="bg-muted rounded-lg p-6 text-center relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="h-8 w-8"
                  title="Copy result"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClear}
                  className="h-8 w-8"
                  title="Clear all"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
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

// Backward compatibility export
export { UnitConversionTemplate as FormulaConverter }
