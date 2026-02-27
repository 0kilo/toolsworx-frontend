"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Route, Fuel, Clock } from "lucide-react"
import { AdventureActions } from "@/components/shared/adventure-actions"
import { useLocalPreset } from "@/lib/hooks/use-local-preset"
import toolContent from "./route-time-planner.json"
import { AboutDescription } from "@/components/ui/about-description"
import {
  calculateRoutePlan,
  calculatePaceEta,
  calculateRideRange,
  MODE_DEFAULTS,
  MODE_LABELS,
} from "@/lib/tools/logic/adventure/tool-route-time-planner"

interface RoutePreset {
  mode: string
  distanceKm: string
  speedKph: string
  paceMinPerKm: string
  breakMinutes: string
  fuelEfficiencyKmPerL: string
  fuelPricePerL: string
  tollCost: string
  tankSizeLiters: string
  reservePercent: string
}

export default function RouteTimePlannerClient() {
  const [activeTab, setActiveTab] = useState<"route" | "pace" | "range">("route")

  // Route planner state
  const [mode, setMode] = useState<"driving" | "cycling" | "hiking" | "motorcycle">("driving")
  const [distanceKm, setDistanceKm] = useState("420")
  const [speedKph, setSpeedKph] = useState("80")
  const [breakMinutes, setBreakMinutes] = useState("40")
  const [fuelEfficiencyKmPerL, setFuelEfficiencyKmPerL] = useState("16")
  const [fuelPricePerL, setFuelPricePerL] = useState("1.5")
  const [tollCost, setTollCost] = useState("12")

  // Pace calculator state
  const [paceDistanceKm, setPaceDistanceKm] = useState("24")
  const [paceMinPerKm, setPaceMinPerKm] = useState("12")
  const [paceBreakMinutes, setPaceBreakMinutes] = useState("35")

  // Range planner state
  const [tankSizeLiters, setTankSizeLiters] = useState("18")
  const [kmPerLiter, setKmPerLiter] = useState("20")
  const [reservePercent, setReservePercent] = useState("12")
  const [routeDistanceKm, setRouteDistanceKm] = useState("640")

  const { savePreset, loadPreset, clearPreset } = useLocalPreset<RoutePreset>("adventure:route-time-planner")

  // Route calculation
  const routeResult = useMemo(() => calculateRoutePlan({
    mode,
    distanceKm: Number(distanceKm) || 0,
    speedKph: Number(speedKph) || MODE_DEFAULTS[mode]?.speedKph || 80,
    breakMinutes: Number(breakMinutes) || 0,
    fuelEfficiencyKmPerL: Number(fuelEfficiencyKmPerL) || 0,
    fuelPricePerL: Number(fuelPricePerL) || 0,
    tollCost: Number(tollCost) || 0,
    tankSizeLiters: mode === "motorcycle" ? Number(tankSizeLiters) || 0 : undefined,
    reservePercent: mode === "motorcycle" ? Number(reservePercent) || 10 : undefined,
  }), [mode, distanceKm, speedKph, breakMinutes, fuelEfficiencyKmPerL, fuelPricePerL, tollCost, tankSizeLiters, reservePercent])

  // Pace calculation
  const paceResult = useMemo(() => calculatePaceEta({
    distanceKm: Number(paceDistanceKm) || 0,
    paceMinPerKm: Number(paceMinPerKm) || 0,
    breakMinutes: Number(paceBreakMinutes) || 0,
  }), [paceDistanceKm, paceMinPerKm, paceBreakMinutes])

  // Range calculation
  const rangeResult = useMemo(() => calculateRideRange({
    tankLiters: Number(tankSizeLiters) || 0,
    kmPerLiter: Number(kmPerLiter) || 0,
    reservePercent: Number(reservePercent) || 10,
    routeDistanceKm: Number(routeDistanceKm) || 0,
  }), [tankSizeLiters, kmPerLiter, reservePercent, routeDistanceKm])

  const routeSummary = `Route Plan\nMode: ${MODE_LABELS[mode]}\nDistance: ${distanceKm} km\nMoving: ${routeResult.movingTimeHours} h\nTotal: ${routeResult.totalTimeHours} h${routeResult.fuelLiters ? `\nFuel: ${routeResult.fuelLiters} L` : ""}${routeResult.cost ? `\nCost: $${routeResult.cost}` : ""}`

  const paceSummary = `Pace & ETA\nDistance: ${paceDistanceKm} km\nPace: ${paceResult.pacePerKm} min/km\nMoving: ${paceResult.movingTimeHours} h\nTotal: ${paceResult.totalTimeHours} h`

  const rangeSummary = `Range Plan\nTank: ${tankSizeLiters} L\nEfficiency: ${kmPerLiter} km/L\nSafe Range: ${rangeResult.safeRangeKm} km\nStops: ${rangeResult.estimatedStops}`

  const handleModeChange = (newMode: "driving" | "cycling" | "hiking" | "motorcycle") => {
    setMode(newMode)
    const defaults = MODE_DEFAULTS[newMode]
    if (defaults?.speedKph) {
      setSpeedKph(defaults.speedKph.toString())
    }
  }

  return (
    <div className="container py-8 md:py-12">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            {toolContent.title}
          </CardTitle>
          <CardDescription>{toolContent.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="route">
                <Route className="h-4 w-4 mr-2" />
                Route Planner
              </TabsTrigger>
              <TabsTrigger value="pace">
                <Clock className="h-4 w-4 mr-2" />
                Pace Calculator
              </TabsTrigger>
              <TabsTrigger value="range">
                <Fuel className="h-4 w-4 mr-2" />
                Range Planner
              </TabsTrigger>
            </TabsList>

            {/* Route Planner Tab */}
            <TabsContent value="route" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Travel Mode</Label>
                  <Select value={mode} onValueChange={(v) => handleModeChange(v as typeof mode)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(MODE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Distance (km)</Label>
                  <Input value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} inputMode="decimal" />
                </div>
                <div className="space-y-2">
                  <Label>Avg Speed (km/h)</Label>
                  <Input value={speedKph} onChange={(e) => setSpeedKph(e.target.value)} inputMode="decimal" />
                </div>
                <div className="space-y-2">
                  <Label>Break Time (minutes)</Label>
                  <Input value={breakMinutes} onChange={(e) => setBreakMinutes(e.target.value)} inputMode="decimal" />
                </div>
                {(mode === "driving" || mode === "motorcycle") && (
                  <>
                    <div className="space-y-2">
                      <Label>Fuel Efficiency (km/L)</Label>
                      <Input value={fuelEfficiencyKmPerL} onChange={(e) => setFuelEfficiencyKmPerL(e.target.value)} inputMode="decimal" />
                    </div>
                    <div className="space-y-2">
                      <Label>Fuel Price ($/L)</Label>
                      <Input value={fuelPricePerL} onChange={(e) => setFuelPricePerL(e.target.value)} inputMode="decimal" />
                    </div>
                    <div className="space-y-2">
                      <Label>Toll Costs ($)</Label>
                      <Input value={tollCost} onChange={(e) => setTollCost(e.target.value)} inputMode="decimal" />
                    </div>
                  </>
                )}
                {mode === "motorcycle" && (
                  <>
                    <div className="space-y-2">
                      <Label>Tank Size (L)</Label>
                      <Input value={tankSizeLiters} onChange={(e) => setTankSizeLiters(e.target.value)} inputMode="decimal" />
                    </div>
                    <div className="space-y-2">
                      <Label>Reserve (%)</Label>
                      <Input value={reservePercent} onChange={(e) => setReservePercent(e.target.value)} inputMode="decimal" />
                    </div>
                  </>
                )}
              </div>

              <div className="rounded-lg border p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Moving Time</div>
                    <div className="text-2xl font-bold">{routeResult.movingTimeHours} h</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total ETA</div>
                    <div className="text-2xl font-bold">{routeResult.totalTimeHours} h</div>
                  </div>
                </div>
                {routeResult.fuelLiters !== undefined && (
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                    <div>
                      <div className="text-sm text-muted-foreground">Fuel Needed</div>
                      <div className="text-lg font-semibold">{routeResult.fuelLiters} L</div>
                    </div>
                    {routeResult.cost !== undefined && (
                      <div>
                        <div className="text-sm text-muted-foreground">Total Cost</div>
                        <div className="text-lg font-semibold">${routeResult.cost}</div>
                      </div>
                    )}
                  </div>
                )}
                {routeResult.fuelStops !== undefined && (
                  <div className="pt-3 border-t">
                    <div className="text-sm text-muted-foreground mb-1">Fuel Stop Planning</div>
                    <div className="text-sm">
                      Safe range: <span className="font-semibold">{routeResult.safeRangeKm} km</span> | 
                      Stop every: <span className="font-semibold">{routeResult.stopIntervalKm} km</span> | 
                      Estimated stops: <span className="font-semibold">{routeResult.fuelStops}</span>
                    </div>
                  </div>
                )}
              </div>

              <AdventureActions
                summaryText={routeSummary}
                exportFilename="route-plan.txt"
                enablePdf
                onSavePreset={() => savePreset({
                  mode, distanceKm, speedKph, paceMinPerKm, breakMinutes,
                  fuelEfficiencyKmPerL, fuelPricePerL, tollCost, tankSizeLiters, reservePercent
                })}
                onLoadPreset={() => {
                  const preset = loadPreset()
                  if (!preset) return false
                  setMode(preset.mode as typeof mode)
                  setDistanceKm(preset.distanceKm)
                  setSpeedKph(preset.speedKph)
                  setPaceMinPerKm(preset.paceMinPerKm)
                  setBreakMinutes(preset.breakMinutes)
                  setFuelEfficiencyKmPerL(preset.fuelEfficiencyKmPerL)
                  setFuelPricePerL(preset.fuelPricePerL)
                  setTollCost(preset.tollCost)
                  setTankSizeLiters(preset.tankSizeLiters)
                  setReservePercent(preset.reservePercent)
                  return true
                }}
                onClearPreset={() => clearPreset()}
              />
            </TabsContent>

            {/* Pace Calculator Tab */}
            <TabsContent value="pace" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Distance (km)</Label>
                  <Input value={paceDistanceKm} onChange={(e) => setPaceDistanceKm(e.target.value)} inputMode="decimal" />
                </div>
                <div className="space-y-2">
                  <Label>Pace (min/km)</Label>
                  <Input value={paceMinPerKm} onChange={(e) => setPaceMinPerKm(e.target.value)} inputMode="decimal" />
                </div>
                <div className="space-y-2">
                  <Label>Break Time (minutes)</Label>
                  <Input value={paceBreakMinutes} onChange={(e) => setPaceBreakMinutes(e.target.value)} inputMode="decimal" />
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Moving Time</div>
                    <div className="text-2xl font-bold">{paceResult.movingTimeHours} h</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total ETA</div>
                    <div className="text-2xl font-bold">{paceResult.totalTimeHours} h</div>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t">
                  <div className="text-sm text-muted-foreground">Pace</div>
                  <div className="text-lg font-semibold">{paceResult.pacePerKm} min/km</div>
                </div>
              </div>

              <AdventureActions
                summaryText={paceSummary}
                exportFilename="pace-eta.txt"
                enablePdf
                onSavePreset={() => savePreset({
                  mode, distanceKm, speedKph, paceMinPerKm, breakMinutes: paceBreakMinutes,
                  fuelEfficiencyKmPerL, fuelPricePerL, tollCost, tankSizeLiters, reservePercent
                })}
                onLoadPreset={() => {
                  const preset = loadPreset()
                  if (!preset) return false
                  setPaceDistanceKm(preset.distanceKm)
                  setPaceMinPerKm(preset.paceMinPerKm)
                  setPaceBreakMinutes(preset.breakMinutes)
                  return true
                }}
                onClearPreset={() => clearPreset()}
              />
            </TabsContent>

            {/* Range Planner Tab */}
            <TabsContent value="range" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tank Size (L)</Label>
                  <Input value={tankSizeLiters} onChange={(e) => setTankSizeLiters(e.target.value)} inputMode="decimal" />
                </div>
                <div className="space-y-2">
                  <Label>Fuel Efficiency (km/L)</Label>
                  <Input value={kmPerLiter} onChange={(e) => setKmPerLiter(e.target.value)} inputMode="decimal" />
                </div>
                <div className="space-y-2">
                  <Label>Reserve (%)</Label>
                  <Input value={reservePercent} onChange={(e) => setReservePercent(e.target.value)} inputMode="decimal" />
                </div>
                <div className="space-y-2">
                  <Label>Route Distance (km)</Label>
                  <Input value={routeDistanceKm} onChange={(e) => setRouteDistanceKm(e.target.value)} inputMode="decimal" />
                </div>
              </div>

              <div className="rounded-lg border p-4 space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Safe Range</div>
                    <div className="text-xl font-bold">{rangeResult.safeRangeKm} km</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Stop Interval</div>
                    <div className="text-xl font-bold">{rangeResult.stopIntervalKm} km</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Fuel Stops</div>
                    <div className="text-xl font-bold">{rangeResult.estimatedStops}</div>
                  </div>
                </div>
                <div className="pt-3 border-t">
                  <div className="text-sm text-muted-foreground">Fuel Needed for Route</div>
                  <div className="text-lg font-semibold">{rangeResult.fuelNeededLiters} L</div>
                </div>
              </div>

              <AdventureActions
                summaryText={rangeSummary}
                exportFilename="range-plan.txt"
                enablePdf
                onSavePreset={() => savePreset({
                  mode, distanceKm, speedKph, paceMinPerKm, breakMinutes,
                  fuelEfficiencyKmPerL, fuelPricePerL, tollCost, tankSizeLiters, reservePercent
                })}
                onLoadPreset={() => {
                  const preset = loadPreset()
                  if (!preset) return false
                  setTankSizeLiters(preset.tankSizeLiters)
                  setKmPerLiter(preset.fuelEfficiencyKmPerL)
                  setReservePercent(preset.reservePercent)
                  setRouteDistanceKm(preset.distanceKm)
                  return true
                }}
                onClearPreset={() => clearPreset()}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AboutDescription
        title={`About ${toolContent.title}`}
        description={toolContent.description}
        sections={toolContent.sections}
      />
    </div>
  )
}
