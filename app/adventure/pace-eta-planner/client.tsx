"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AdventureActions } from "@/components/shared/adventure-actions"
import { useLocalPreset } from "@/lib/hooks/use-local-preset"
import toolContent from "./pace-eta-planner.json"
import { AboutDescription } from "@/components/ui/about-description"
import { calculatePaceEta } from "@/lib/tools/logic/adventure/tool-pace-eta-planner"

interface PacePreset {
  distanceKm: string
  paceMinPerKm: string
  breakMinutes: string
}

export default function AdventureToolClient() {
  const [distanceKm, setDistanceKm] = useState("24")
  const [paceMinPerKm, setPaceMinPerKm] = useState("7")
  const [breakMinutes, setBreakMinutes] = useState("35")
  const { savePreset, loadPreset, clearPreset } = useLocalPreset<PacePreset>("adventure:pace-eta-planner")

  const result = useMemo(() => calculatePaceEta({
    distanceKm: Number(distanceKm) || 0,
    paceMinPerKm: Number(paceMinPerKm) || 0,
    breakMinutes: Number(breakMinutes) || 0,
  }), [distanceKm, paceMinPerKm, breakMinutes])

  const summaryText = `Pace & ETA\nDistance: ${distanceKm} km\nPace: ${paceMinPerKm} min/km\nMoving: ${result.movingHours} h\nTotal: ${result.totalHours} h`

  return (
    <div className="container py-8 md:py-12"><Card><CardHeader><CardTitle>{toolContent.pageTitle}</CardTitle><CardDescription>{toolContent.pageDescription}</CardDescription></CardHeader><CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2"><Label>Distance (km)</Label><Input value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} inputMode="decimal" /></div>
        <div className="space-y-2"><Label>Pace (min/km)</Label><Input value={paceMinPerKm} onChange={(e) => setPaceMinPerKm(e.target.value)} inputMode="decimal" /></div>
        <div className="space-y-2"><Label>Breaks (minutes)</Label><Input value={breakMinutes} onChange={(e) => setBreakMinutes(e.target.value)} inputMode="decimal" /></div>
      </div>
      <div className="rounded-lg border p-4 text-sm space-y-1">
        <p>Moving time: <span className="font-semibold">{result.movingHours} h</span></p>
        <p>Total ETA: <span className="font-semibold">{result.totalHours} h</span></p>
      </div>
      <AdventureActions
        summaryText={summaryText}
        exportFilename="pace-eta.txt"
        enablePdf
        onSavePreset={() => savePreset({ distanceKm, paceMinPerKm, breakMinutes })}
        onLoadPreset={() => {
          const preset = loadPreset()
          if (!preset) return false
          setDistanceKm(preset.distanceKm)
          setPaceMinPerKm(preset.paceMinPerKm)
          setBreakMinutes(preset.breakMinutes)
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
