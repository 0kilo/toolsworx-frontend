"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Share2 } from "lucide-react"
import { ShareComponent } from "@/components/shared/share-component"
import { useShare } from "@/lib/hooks/use-share"

interface Unit {
  value: string
  label: string
  abbreviation: string
  factor: number // Conversion factor to base unit
}

interface UnitConverterProps {
  title: string
  description: string
  units: Unit[]
  baseUnit: string
  icon: React.ComponentType<{ className?: string }>
  defaultFromUnit?: string
  defaultToUnit?: string
}

export function UnitConverter({
  title,
  description,
  units,
  baseUnit,
  icon: Icon,
  defaultFromUnit,
  defaultToUnit
}: UnitConverterProps) {
  const [fromUnit, setFromUnit] = useState(defaultFromUnit || units[0]?.value || "")
  const [toUnit, setToUnit] = useState(defaultToUnit || units[1]?.value || "")
  const [fromValue, setFromValue] = useState("")
  const [toValue, setToValue] = useState("")
  const { isShareOpen, shareData, openShare, closeShare } = useShare()

  const convertValue = (value: string, from: string, to: string) => {
    if (!value || isNaN(Number(value))) return ""
    
    const fromUnitData = units.find(u => u.value === from)
    const toUnitData = units.find(u => u.value === to)
    
    if (!fromUnitData || !toUnitData) return ""
    
    const baseValue = Number(value) * fromUnitData.factor
    const result = baseValue / toUnitData.factor
    
    return result.toString()
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

  const handleShare = () => {
    if (!fromValue || !toValue) return
    
    const fromUnitData = units.find(u => u.value === fromUnit)
    const toUnitData = units.find(u => u.value === toUnit)
    
    const content = `${fromValue} ${fromUnitData?.abbreviation} = ${toValue} ${toUnitData?.abbreviation}`
    
    openShare({
      content,
      title: `${title} Conversion Result`,
      type: 'conversion'
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
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
          <Button 
            variant="outline" 
            onClick={handleShare} 
            disabled={!fromValue || !toValue}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
      
      {isShareOpen && shareData && (
        <ShareComponent
          content={shareData.content}
          title={shareData.title}
          type={shareData.type}
          onClose={closeShare}
        />
      )}
    </Card>
  )
}