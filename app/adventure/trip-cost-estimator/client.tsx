"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AdventureActions } from "@/components/shared/adventure-actions"
import { useLocalPreset } from "@/lib/hooks/use-local-preset"
import toolContent from "./trip-cost-estimator.json"
import { AboutDescription } from "@/components/ui/about-description"
import { calculateTripCost } from "@/lib/tools/logic/adventure/tool-trip-cost-estimator"

interface CostPreset {
  days: string
  fuelPerDay: string
  lodgingPerDay: string
  mealsPerDay: string
  activitiesPerDay: string
  miscPerDay: string
}

export default function AdventureToolClient() {
  const [days, setDays] = useState("5")
  const [fuelPerDay, setFuelPerDay] = useState("28")
  const [lodgingPerDay, setLodgingPerDay] = useState("80")
  const [mealsPerDay, setMealsPerDay] = useState("35")
  const [activitiesPerDay, setActivitiesPerDay] = useState("25")
  const [miscPerDay, setMiscPerDay] = useState("15")
  const { savePreset, loadPreset, clearPreset } = useLocalPreset<CostPreset>("adventure:trip-cost-estimator")

  const result = useMemo(() => calculateTripCost({
    days: Number(days) || 0,
    fuelPerDay: Number(fuelPerDay) || 0,
    lodgingPerDay: Number(lodgingPerDay) || 0,
    mealsPerDay: Number(mealsPerDay) || 0,
    activitiesPerDay: Number(activitiesPerDay) || 0,
    miscPerDay: Number(miscPerDay) || 0,
  }), [days, fuelPerDay, lodgingPerDay, mealsPerDay, activitiesPerDay, miscPerDay])

  const summaryText = `Trip Cost Estimator\nPer day: ${result.perDay}\nTotal (${days} days): ${result.total}`

  return (
    <div className="container py-8 md:py-12"><Card><CardHeader><CardTitle>{toolContent.pageTitle}</CardTitle><CardDescription>{toolContent.pageDescription}</CardDescription></CardHeader><CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2"><Label>Days</Label><Input value={days} onChange={(e) => setDays(e.target.value)} inputMode="numeric" /></div>
        <div className="space-y-2"><Label>Fuel / day</Label><Input value={fuelPerDay} onChange={(e) => setFuelPerDay(e.target.value)} inputMode="decimal" /></div>
        <div className="space-y-2"><Label>Lodging / day</Label><Input value={lodgingPerDay} onChange={(e) => setLodgingPerDay(e.target.value)} inputMode="decimal" /></div>
        <div className="space-y-2"><Label>Meals / day</Label><Input value={mealsPerDay} onChange={(e) => setMealsPerDay(e.target.value)} inputMode="decimal" /></div>
        <div className="space-y-2"><Label>Activities / day</Label><Input value={activitiesPerDay} onChange={(e) => setActivitiesPerDay(e.target.value)} inputMode="decimal" /></div>
        <div className="space-y-2"><Label>Misc / day</Label><Input value={miscPerDay} onChange={(e) => setMiscPerDay(e.target.value)} inputMode="decimal" /></div>
      </div>
      <div className="rounded-lg border p-4 text-sm space-y-1">
        <p>Estimated per day: <span className="font-semibold">{result.perDay}</span></p>
        <p>Estimated total: <span className="font-semibold">{result.total}</span></p>
      </div>
      <AdventureActions
        summaryText={summaryText}
        exportFilename="trip-cost-estimate.txt"
        enablePdf
        onSavePreset={() => savePreset({ days, fuelPerDay, lodgingPerDay, mealsPerDay, activitiesPerDay, miscPerDay })}
        onLoadPreset={() => {
          const preset = loadPreset()
          if (!preset) return false
          setDays(preset.days)
          setFuelPerDay(preset.fuelPerDay)
          setLodgingPerDay(preset.lodgingPerDay)
          setMealsPerDay(preset.mealsPerDay)
          setActivitiesPerDay(preset.activitiesPerDay)
          setMiscPerDay(preset.miscPerDay)
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
