"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AdventureActions } from "@/components/shared/adventure-actions"
import { useLocalPreset } from "@/lib/hooks/use-local-preset"
import toolContent from "./water-food-planner.json"
import { AboutDescription } from "@/components/ui/about-description"
import { calculateWaterFood } from "@/lib/tools/logic/adventure/tool-water-food-planner"

interface WaterFoodPreset {
  people: string
  days: string
  activityLevel: "low" | "medium" | "high"
  hotWeather: boolean
}

export default function AdventureToolClient() {
  const [people, setPeople] = useState("2")
  const [days, setDays] = useState("3")
  const [activityLevel, setActivityLevel] = useState<"low" | "medium" | "high">("medium")
  const [hotWeather, setHotWeather] = useState(false)
  const { savePreset, loadPreset, clearPreset } = useLocalPreset<WaterFoodPreset>("adventure:water-food-planner")

  const result = useMemo(() => calculateWaterFood({
    people: Number(people) || 0,
    days: Number(days) || 0,
    activityLevel,
    hotWeather,
  }), [people, days, activityLevel, hotWeather])

  const summaryText = `Water & Food Planner\nPeople: ${people}\nDays: ${days}\nWater: ${result.litersTotal} L\nCalories: ${result.caloriesTotal}`

  return (
    <div className="container py-8 md:py-12"><Card><CardHeader><CardTitle>{toolContent.pageTitle}</CardTitle><CardDescription>{toolContent.pageDescription}</CardDescription></CardHeader><CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2"><Label>People</Label><Input value={people} onChange={(e) => setPeople(e.target.value)} inputMode="numeric" /></div>
        <div className="space-y-2"><Label>Days</Label><Input value={days} onChange={(e) => setDays(e.target.value)} inputMode="numeric" /></div>
        <div className="space-y-2"><Label>Activity level</Label><Select value={activityLevel} onValueChange={(v) => {
          if (v === "low" || v === "medium" || v === "high") {
            setActivityLevel(v)
          }
        }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent></Select></div>
        <div className="flex items-center gap-2"><Checkbox checked={hotWeather} onCheckedChange={(v) => setHotWeather(Boolean(v))} /><Label>Hot weather</Label></div>
      </div>
      <div className="rounded-lg border p-4 text-sm space-y-1"><p>Total water: <span className="font-semibold">{result.litersTotal} L</span></p><p>Total calories: <span className="font-semibold">{result.caloriesTotal}</span></p></div>
      <AdventureActions
        summaryText={summaryText}
        exportFilename="water-food-plan.txt"
        enablePdf
        onSavePreset={() => savePreset({ people, days, activityLevel, hotWeather })}
        onLoadPreset={() => {
          const preset = loadPreset()
          if (!preset) return false
          setPeople(preset.people)
          setDays(preset.days)
          setActivityLevel(preset.activityLevel)
          setHotWeather(preset.hotWeather)
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
