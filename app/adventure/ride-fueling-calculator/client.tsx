"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdventureActions } from "@/components/shared/adventure-actions"
import { useLocalPreset } from "@/lib/hooks/use-local-preset"
import toolContent from "./ride-fueling-calculator.json"
import { AboutDescription } from "@/components/ui/about-description"
import { calculateRideFueling } from "@/lib/tools/logic/adventure/tool-ride-fueling-calculator"

interface FuelingPreset {
  durationHours: string
  intensity: "easy" | "moderate" | "hard"
}

export default function AdventureToolClient() {
  const [durationHours, setDurationHours] = useState("3.5")
  const [intensity, setIntensity] = useState<"easy" | "moderate" | "hard">("moderate")
  const { savePreset, loadPreset, clearPreset } = useLocalPreset<FuelingPreset>("adventure:ride-fueling-calculator")

  const result = useMemo(() => calculateRideFueling({
    durationHours: Number(durationHours) || 0,
    intensity,
  }), [durationHours, intensity])

  const summaryText = `Ride Fueling\nDuration: ${durationHours} h\nIntensity: ${intensity}\nCarbs/h: ${result.carbsPerHour} g\nFluid/h: ${result.fluidMlPerHour} ml\nSodium/h: ${result.sodiumMgPerHour} mg\nTotal carbs: ${result.carbsTotal} g`

  return (
    <div className="container py-8 md:py-12"><Card><CardHeader><CardTitle>{toolContent.pageTitle}</CardTitle><CardDescription>{toolContent.pageDescription}</CardDescription></CardHeader><CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Duration (hours)</Label><Input value={durationHours} onChange={(e) => setDurationHours(e.target.value)} inputMode="decimal" /></div>
        <div className="space-y-2"><Label>Intensity</Label><Select value={intensity} onValueChange={(v) => {
          if (v === "easy" || v === "moderate" || v === "hard") {
            setIntensity(v)
          }
        }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="easy">Easy</SelectItem><SelectItem value="moderate">Moderate</SelectItem><SelectItem value="hard">Hard</SelectItem></SelectContent></Select></div>
      </div>
      <div className="rounded-lg border p-4 text-sm space-y-1">
        <p>Carbs / hour: <span className="font-semibold">{result.carbsPerHour} g</span></p>
        <p>Fluid / hour: <span className="font-semibold">{result.fluidMlPerHour} ml</span></p>
        <p>Sodium / hour: <span className="font-semibold">{result.sodiumMgPerHour} mg</span></p>
        <p>Carbs total: <span className="font-semibold">{result.carbsTotal} g</span></p>
      </div>
      <AdventureActions
        summaryText={summaryText}
        exportFilename="ride-fueling-plan.txt"
        enablePdf
        onSavePreset={() => savePreset({ durationHours, intensity })}
        onLoadPreset={() => {
          const preset = loadPreset()
          if (!preset) return false
          setDurationHours(preset.durationHours)
          setIntensity(preset.intensity)
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
