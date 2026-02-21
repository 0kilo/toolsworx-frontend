"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AdventureActions } from "@/components/shared/adventure-actions"
import { useLocalPreset } from "@/lib/hooks/use-local-preset"
import toolContent from "./smart-packing-list-builder.json"
import { AboutDescription } from "@/components/ui/about-description"
import { buildSmartPackingList } from "@/lib/tools/logic/adventure/tool-smart-packing-list-builder"

interface SmartPackingPreset {
  tripType: "city" | "outdoor" | "motorcycle"
  days: string
  tempC: string
  rainy: boolean
}

export default function AdventureToolClient() {
  const [tripType, setTripType] = useState<"city" | "outdoor" | "motorcycle">("outdoor")
  const [days, setDays] = useState("4")
  const [tempC, setTempC] = useState("14")
  const [rainy, setRainy] = useState(true)
  const { savePreset, loadPreset, clearPreset } = useLocalPreset<SmartPackingPreset>("adventure:smart-packing-list-builder")

  const items = useMemo(() => buildSmartPackingList({
    tripType,
    days: Number(days) || 0,
    tempC: Number(tempC) || 0,
    rainy,
  }), [tripType, days, tempC, rainy])

  const summaryText = `Smart Packing List\nType: ${tripType}\nDays: ${days}\nTemp: ${tempC}C\nRain: ${rainy ? "Yes" : "No"}\n\n${items.map((i) => `- ${i}`).join("\n")}`

  return (
    <div className="container py-8 md:py-12"><Card><CardHeader><CardTitle>{toolContent.pageTitle}</CardTitle><CardDescription>{toolContent.pageDescription}</CardDescription></CardHeader><CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Trip type</Label><Select value={tripType} onValueChange={(v) => {
          if (v === "city" || v === "outdoor" || v === "motorcycle") {
            setTripType(v)
          }
        }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="city">City</SelectItem><SelectItem value="outdoor">Outdoor</SelectItem><SelectItem value="motorcycle">Motorcycle</SelectItem></SelectContent></Select></div>
        <div className="space-y-2"><Label>Days</Label><Input value={days} onChange={(e) => setDays(e.target.value)} inputMode="numeric" /></div>
        <div className="space-y-2"><Label>Average temp (C)</Label><Input value={tempC} onChange={(e) => setTempC(e.target.value)} inputMode="decimal" /></div>
        <div className="flex items-center gap-2"><Checkbox checked={rainy} onCheckedChange={(v) => setRainy(Boolean(v))} /><Label>Rain expected</Label></div>
      </div>
      <ul className="rounded-lg border p-4 text-sm space-y-1">{items.map((item) => <li key={item}>- {item}</li>)}</ul>
      <AdventureActions
        summaryText={summaryText}
        exportFilename="smart-packing-list.txt"
        onSavePreset={() => savePreset({ tripType, days, tempC, rainy })}
        onLoadPreset={() => {
          const preset = loadPreset()
          if (!preset) return false
          setTripType(preset.tripType)
          setDays(preset.days)
          setTempC(preset.tempC)
          setRainy(preset.rainy)
          return true
        }}
        onClearPreset={() => clearPreset()}
      />
    </CardContent></Card>
      <AboutDescription
        title={`About ${toolContent.title}`}
        description={toolContent.description}
        sections={toolContent.sections}
      />
    </div>
  )
}
