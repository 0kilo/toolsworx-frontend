"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Copy, RotateCcw, Check } from "lucide-react"

/**
 * CALCULATOR TEMPLATE
 *
 * Use this template for calculators that compute values from multiple inputs.
 * Examples: Mortgage calculator, BMI calculator, Tip calculator, etc.
 *
 * Difference from Converter:
 * - Converter: Change units (5 km → 3.1 miles)
 * - Calculator: Compute new value (loan + rate + term → monthly payment)
 */

// ========================================
// TYPES
// ========================================

export interface CalculatorField {
  name: string
  label: string
  type: "number" | "select" | "text" | "date"
  placeholder?: string
  options?: { value: string; label: string }[]
  defaultValue?: string | number
  min?: number
  max?: number
  step?: number
  required?: boolean
  helpText?: string
}

export interface CalculatorResult {
  label: string
  value: string | number
  highlight?: boolean // Highlight primary result
  format?: "currency" | "percentage" | "number" | "text"
  helpText?: string
}

export interface CalculatorTemplateProps {
  title: string
  description: string
  fields: CalculatorField[]
  onCalculate: (inputs: Record<string, any>) => CalculatorResult[]
  resultTitle?: string
  infoContent?: React.ReactNode // Additional SEO content below calculator
  icon?: any // Optional icon prop
}

// ========================================
// COMPONENT
// ========================================

export function CalculatorTemplate({
  title,
  description,
  fields,
  onCalculate,
  resultTitle = "Results",
  infoContent,
  icon,
}: CalculatorTemplateProps) {
  const [inputs, setInputs] = useState<Record<string, any>>(() => {
    const defaults: Record<string, any> = {}
    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        defaults[field.name] = field.defaultValue
      }
    })
    return defaults
  })

  const [results, setResults] = useState<CalculatorResult[] | null>(null)
  const [copied, setCopied] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateInputs = (): boolean => {
    const newErrors: Record<string, string> = {}

    fields.forEach(field => {
      if (field.required && !inputs[field.name]) {
        newErrors[field.name] = `${field.label} is required`
      }

      if (field.type === "number" && inputs[field.name]) {
        const value = parseFloat(inputs[field.name])
        if (isNaN(value)) {
          newErrors[field.name] = "Must be a valid number"
        } else {
          if (field.min !== undefined && value < field.min) {
            newErrors[field.name] = `Must be at least ${field.min}`
          }
          if (field.max !== undefined && value > field.max) {
            newErrors[field.name] = `Must be at most ${field.max}`
          }
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCalculate = () => {
    if (!validateInputs()) {
      return
    }

    try {
      const calculatedResults = onCalculate(inputs)
      setResults(calculatedResults)
    } catch (error) {
      alert("Calculation error. Please check your inputs.")
      console.error(error)
    }
  }

  const handleInputChange = (name: string, value: any) => {
    setInputs(prev => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleClear = () => {
    const defaults: Record<string, any> = {}
    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        defaults[field.name] = field.defaultValue
      }
    })
    setInputs(defaults)
    setResults(null)
    setErrors({})
    setCopied(false)
  }

  const handleCopy = async () => {
    if (!results) return

    const textToCopy = results
      .map(result => `${result.label}: ${result.value}`)
      .join("\n")

    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const formatValue = (result: CalculatorResult): string => {
    if (typeof result.value === "string") return result.value

    switch (result.format) {
      case "currency":
        return `$${result.value.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      case "percentage":
        return `${result.value.toFixed(2)}%`
      case "number":
        return result.value.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      default:
        return result.value.toString()
    }
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {/* Calculator Card */}
      <Card>
        <CardHeader>
          <CardTitle>Calculate</CardTitle>
          <CardDescription>Enter your values below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>

                {field.type === "select" ? (
                  <Select
                    value={inputs[field.name] || ""}
                    onValueChange={(value) => handleInputChange(field.name, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={inputs[field.name] || ""}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                  />
                )}

                {field.helpText && (
                  <p className="text-xs text-muted-foreground">{field.helpText}</p>
                )}

                {errors[field.name] && (
                  <p className="text-xs text-red-500">{errors[field.name]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button onClick={handleCalculate} className="flex-1" size="lg">
              Calculate
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Clear
            </Button>
          </div>

          {/* Results */}
          {results && results.length > 0 && (
            <div className="bg-muted rounded-lg p-6 relative">
              <div className="absolute top-4 right-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="h-8 w-8"
                  title="Copy results"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <h3 className="text-lg font-semibold mb-4">{resultTitle}</h3>

              <div className="space-y-3">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded ${
                      result.highlight
                        ? "bg-primary/10 border border-primary/20"
                        : "bg-background"
                    }`}
                  >
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        {result.label}
                      </p>
                      {result.helpText && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {result.helpText}
                        </p>
                      )}
                    </div>
                    <p
                      className={`text-xl font-bold ${
                        result.highlight ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {formatValue(result)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Info/SEO Content */}
      {infoContent && (
        <Card>
          <CardContent className="pt-6">{infoContent}</CardContent>
        </Card>
      )}
    </div>
  )
}

// ========================================
// HELPER: Calculate Button Component
// ========================================

export function CalculateButton({
  onClick,
  disabled,
  loading,
}: {
  onClick: () => void
  disabled?: boolean
  loading?: boolean
}) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full"
      size="lg"
    >
      {loading ? "Calculating..." : "Calculate"}
    </Button>
  )
}
