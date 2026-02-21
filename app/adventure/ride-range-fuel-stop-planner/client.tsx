"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AdventureActions } from "@/components/shared/adventure-actions"
import { useLocalPreset } from "@/lib/hooks/use-local-preset"
import toolContent from "./ride-range-fuel-stop-planner.json"
import { AboutDescription } from "@/components/ui/about-description"
import { calculateRideRange } from "@/lib/tools/logic/adventure/tool-ride-range-fuel-stop-planner"

interface RideRangePreset {
  tankLiters: string
  kmPerLiter: string
  reservePercent: string
  routeDistanceKm: string
}

export default function AdventureToolClient() {
  const [tankLiters, setTankLiters] = useState("18")
  const [kmPerLiter, setKmPerLiter] = useState("20")
  const [reservePercent, setReservePercent] = useState("12")
  const [routeDistanceKm, setRouteDistanceKm] = useState("640")
  const { savePreset, loadPreset, clearPreset } = useLocalPreset<RideRangePreset>("adventure:ride-range-fuel-stop-planner")

  const result = useMemo(() => calculateRideRange({
    tankLiters: Number(tankLiters) || 0,
    kmPerLiter: Number(kmPerLiter) || 0,
    reservePercent: Number(reservePercent) || 0,
    routeDistanceKm: Number(routeDistanceKm) || 0,
  }), [tankLiters, kmPerLiter, reservePercent, routeDistanceKm])

  const summaryText = `Ride Range & Fuel Stops\nSafe range: ${result.safeRangeKm} km\nStop interval: ${result.stopIntervalKm} km\nEstimated stops: ${result.estimatedStops}`

  return (
    <div className="container py-8 md:py-12"><Card><CardHeader><CardTitle>{toolContent.pageTitle}</CardTitle><CardDescription>{toolContent.pageDescription}</CardDescription></CardHeader><CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Tank size (L)</Label><Input value={tankLiters} onChange={(e) => setTankLiters(e.target.value)} inputMode="decimal" /></div>
        <div className="space-y-2"><Label>Efficiency (km/L)</Label><Input value={kmPerLiter} onChange={(e) => setKmPerLiter(e.target.value)} inputMode="decimal" /></div>
        <div className="space-y-2"><Label>Reserve (%)</Label><Input value={reservePercent} onChange={(e) => setReservePercent(e.target.value)} inputMode="decimal" /></div>
        <div className="space-y-2"><Label>Route distance (km)</Label><Input value={routeDistanceKm} onChange={(e) => setRouteDistanceKm(e.target.value)} inputMode="decimal" /></div>
      </div>
      <div className="rounded-lg border p-4 text-sm space-y-1">
        <p>Safe range: <span className="font-semibold">{result.safeRangeKm} km</span></p>
        <p>Suggested stop interval: <span className="font-semibold">{result.stopIntervalKm} km</span></p>
        <p>Estimated stops: <span className="font-semibold">{result.estimatedStops}</span></p>
      </div>
      <AdventureActions
        summaryText={summaryText}
        exportFilename="ride-range-fuel-stops.txt"
        enablePdf
        onSavePreset={() => savePreset({ tankLiters, kmPerLiter, reservePercent, routeDistanceKm })}
        onLoadPreset={() => {
          const preset = loadPreset()
          if (!preset) return false
          setTankLiters(preset.tankLiters)
          setKmPerLiter(preset.kmPerLiter)
          setReservePercent(preset.reservePercent)
          setRouteDistanceKm(preset.routeDistanceKm)
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
