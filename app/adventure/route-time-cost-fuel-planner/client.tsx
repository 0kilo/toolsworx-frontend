"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { AdventureActions } from "@/components/shared/adventure-actions"
import { useLocalPreset } from "@/lib/hooks/use-local-preset"
import toolContent from "./route-time-cost-fuel-planner.json"
import { AboutDescription } from "@/components/ui/about-description"
import { calculateRoutePlan } from "@/lib/tools/logic/adventure/tool-route-time-cost-fuel-planner"

interface RoutePreset {
  distanceKm: string
  avgSpeedKph: string
  fuelEfficiencyKmPerL: string
  fuelPricePerL: string
  tollCost: string
  breakMinutes: string
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

function parseDistanceKm(text: string): number | null {
  const normalized = text.replace(/,/g, "")
  const kmMatch = normalized.match(/(\d+(?:\.\d+)?)\s*km\b/i)
  if (kmMatch) return Number(kmMatch[1])

  const miMatch = normalized.match(/(\d+(?:\.\d+)?)\s*mi\b/i)
  if (miMatch) return Number(miMatch[1]) * 1.60934

  return null
}

function parseDurationMinutes(text: string): number | null {
  const normalized = text.toLowerCase().replace(/,/g, "")
  let total = 0

  const hourMatch = normalized.match(/(\d+(?:\.\d+)?)\s*h(?:ours?)?/)
  if (hourMatch) total += Number(hourMatch[1]) * 60

  const minMatch = normalized.match(/(\d+(?:\.\d+)?)\s*m(?:in(?:utes?)?)?/)
  if (minMatch) total += Number(minMatch[1])

  if (!hourMatch && !minMatch) {
    const compactHourMin = normalized.match(/(\d+)\s*hr\s*(\d+)\s*min/)
    if (compactHourMin) {
      total = Number(compactHourMin[1]) * 60 + Number(compactHourMin[2])
    }
  }

  return total > 0 ? total : null
}

function decodeLoose(input: string): string {
  try {
    return decodeURIComponent(input)
  } catch {
    return input
  }
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function extractWaypointCoords(urlOrText: string): Array<{ lat: number; lng: number }> {
  // Google URLs often encode waypoints as ...!2d{lng}!3d{lat}
  const coords: Array<{ lat: number; lng: number }> = []
  const regex = /!2d(-?\d+(?:\.\d+)?)!3d(-?\d+(?:\.\d+)?)/g
  let match: RegExpExecArray | null
  while ((match = regex.exec(urlOrText)) !== null) {
    coords.push({ lng: Number(match[1]), lat: Number(match[2]) })
  }
  return coords
}

function estimateRouteDistanceFromCoordsKm(coords: Array<{ lat: number; lng: number }>): number | null {
  if (coords.length < 2) return null
  let straightLineTotal = 0
  for (let i = 1; i < coords.length; i += 1) {
    straightLineTotal += haversineKm(coords[i - 1].lat, coords[i - 1].lng, coords[i].lat, coords[i].lng)
  }
  // Road routes are usually longer than straight lines.
  return straightLineTotal * 1.22
}

function extractOriginDestinationFromGoogleMapsUrl(input: string): { origin: string; destination: string } | null {
  try {
    const url = new URL(input)
    const originQuery = url.searchParams.get("origin")
    const destinationQuery = url.searchParams.get("destination")

    if (originQuery && destinationQuery) {
      return { origin: originQuery, destination: destinationQuery }
    }

    const pathname = decodeLoose(url.pathname)
    const dirParts = pathname.split("/dir/")
    if (dirParts.length < 2) return null

    const routeParts = dirParts[1]
      .split("/")
      .map((part) => decodeLoose(part).trim())
      .filter(Boolean)
      .filter((part) => !part.startsWith("@"))
      .filter((part) => !part.startsWith("data="))
      .filter((part) => !part.startsWith("entry="))
      .filter((part) => !part.startsWith("g_ep="))
      .filter((part) => !part.startsWith("!"))
    if (routeParts.length < 2) return null

    const origin = routeParts[0]
    const destination = routeParts[routeParts.length - 1]
    if (!origin || !destination) return null

    return { origin, destination }
  } catch {
    return null
  }
}

export default function AdventureToolClient() {
  const [distanceKm, setDistanceKm] = useState("420")
  const [avgSpeedKph, setAvgSpeedKph] = useState("80")
  const [fuelEfficiencyKmPerL, setFuelEfficiencyKmPerL] = useState("16")
  const [fuelPricePerL, setFuelPricePerL] = useState("1.5")
  const [tollCost, setTollCost] = useState("12")
  const [breakMinutes, setBreakMinutes] = useState("40")
  const [mapsInput, setMapsInput] = useState("")
  const [importStatus, setImportStatus] = useState("")
  const [importing, setImporting] = useState(false)

  const { savePreset, loadPreset, clearPreset } = useLocalPreset<RoutePreset>("adventure:route-time-cost-fuel-planner")

  const result = useMemo(
    () =>
      calculateRoutePlan({
        distanceKm: Number(distanceKm) || 0,
        avgSpeedKph: Number(avgSpeedKph) || 0,
        fuelEfficiencyKmPerL: Number(fuelEfficiencyKmPerL) || 0,
        fuelPricePerL: Number(fuelPricePerL) || 0,
        tollCost: Number(tollCost) || 0,
        breakMinutes: Number(breakMinutes) || 0,
      }),
    [distanceKm, avgSpeedKph, fuelEfficiencyKmPerL, fuelPricePerL, tollCost, breakMinutes]
  )

  const summaryText = `Route Time, Cost & Fuel Planner\nDistance: ${distanceKm} km\nDriving: ${result.drivingHours} h\nTotal: ${result.totalHours} h\nFuel: ${result.fuelLiters} L\nCost: ${result.totalCost}`

  const snapshot = (): RoutePreset => ({ distanceKm, avgSpeedKph, fuelEfficiencyKmPerL, fuelPricePerL, tollCost, breakMinutes })

  const importFromGoogleMaps = async () => {
    if (!mapsInput.trim()) {
      setImportStatus("Paste a Google Maps URL or route text first.")
      return
    }

    setImporting(true)
    setImportStatus("")

    let resolvedInput = mapsInput
    try {
      const parsed = new URL(mapsInput)
      if (parsed.hostname.toLowerCase() === "maps.app.goo.gl") {
        const resolveRes = await fetch(`/api/maps/resolve-url?url=${encodeURIComponent(mapsInput)}`)
        const resolveData = await resolveRes.json()
        if (resolveRes.ok && typeof resolveData?.finalUrl === "string") {
          resolvedInput = resolveData.finalUrl
        }
      }
    } catch {
      // Non-URL text input is supported below.
    }

    const decoded = decodeLoose(resolvedInput)
    const parsedDistanceKm = parseDistanceKm(decoded)
    const parsedDurationMin = parseDurationMinutes(decoded)

    if (parsedDistanceKm && parsedDistanceKm > 0) {
      setDistanceKm(parsedDistanceKm.toFixed(1))
    }

    if (parsedDistanceKm && parsedDurationMin && parsedDurationMin > 0) {
      const speed = parsedDistanceKm / (parsedDurationMin / 60)
      if (speed > 10 && speed < 180) {
        setAvgSpeedKph(speed.toFixed(0))
      }
      setImportStatus("Imported distance and average speed from pasted map data.")
      setImporting(false)
      return
    }

    const coords = extractWaypointCoords(decoded)
    const estimatedDistanceKm = estimateRouteDistanceFromCoordsKm(coords)
    if (estimatedDistanceKm && estimatedDistanceKm > 0) {
      setDistanceKm(estimatedDistanceKm.toFixed(1))
      setImportStatus("Imported estimated route distance from map waypoint coordinates.")
      setImporting(false)
      return
    }

    const route = extractOriginDestinationFromGoogleMapsUrl(resolvedInput)
    if (!route) {
      if (parsedDistanceKm) {
        setImportStatus("Imported distance only. Paste a route summary including travel time for speed import.")
      } else {
        setImportStatus("Could not extract route info. Paste a full Google Maps directions URL or include distance/time text.")
      }
      setImporting(false)
      return
    }

    try {
      const res = await fetch("/api/maps/distance-matrix", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          origins: route.origin,
          destinations: route.destination,
          mode: "driving",
          units: "metric",
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "Distance Matrix proxy failed")
      }
      const element = data?.rows?.[0]?.elements?.[0]
      const distanceMeters = element?.distance?.value as number | undefined
      const durationSeconds = element?.duration?.value as number | undefined

      if (distanceMeters && durationSeconds && distanceMeters > 0 && durationSeconds > 0) {
        const distKm = distanceMeters / 1000
        const speed = distKm / (durationSeconds / 3600)
        setDistanceKm(distKm.toFixed(1))
        if (speed > 10 && speed < 180) {
          setAvgSpeedKph(speed.toFixed(0))
        }
        setImportStatus("Imported route distance/time from Google Maps API.")
      } else {
        setImportStatus("Route import found no distance result. Verify origin and destination are valid.")
      }
    } catch {
      if (!GOOGLE_MAPS_API_KEY) {
        setImportStatus("API key not configured server-side. Imported what was possible from URL/text parsing only.")
      } else {
        setImportStatus("Google Maps API import failed. You can still paste route text containing distance and time.")
      }
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="container py-8 md:py-12">
      <Card>
        <CardHeader>
          <CardTitle>{toolContent.pageTitle}</CardTitle>
          <CardDescription>{toolContent.pageDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Google Maps directions URL (or pasted route text)</Label>
            <div className="flex flex-col md:flex-row gap-2">
              <Input
                value={mapsInput}
                onChange={(e) => setMapsInput(e.target.value)}
                placeholder="Paste Google Maps URL or text with distance/time"
              />
              <Button type="button" variant="outline" onClick={importFromGoogleMaps} disabled={importing}>
                {importing ? "Importing..." : "Import"}
              </Button>
            </div>
            {importStatus && <p className="text-xs text-muted-foreground">{importStatus}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Distance (km)</Label><Input value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} inputMode="decimal" /></div>
            <div className="space-y-2"><Label>Avg speed (km/h)</Label><Input value={avgSpeedKph} onChange={(e) => setAvgSpeedKph(e.target.value)} inputMode="decimal" /></div>
            <div className="space-y-2"><Label>Fuel efficiency (km/L)</Label><Input value={fuelEfficiencyKmPerL} onChange={(e) => setFuelEfficiencyKmPerL(e.target.value)} inputMode="decimal" /></div>
            <div className="space-y-2"><Label>Fuel price per L</Label><Input value={fuelPricePerL} onChange={(e) => setFuelPricePerL(e.target.value)} inputMode="decimal" /></div>
            <div className="space-y-2"><Label>Tolls</Label><Input value={tollCost} onChange={(e) => setTollCost(e.target.value)} inputMode="decimal" /></div>
            <div className="space-y-2"><Label>Break minutes</Label><Input value={breakMinutes} onChange={(e) => setBreakMinutes(e.target.value)} inputMode="decimal" /></div>
          </div>

          <div className="rounded-lg border p-4 text-sm space-y-1">
            <p>Driving time: <span className="font-semibold">{result.drivingHours} h</span></p>
            <p>Total time: <span className="font-semibold">{result.totalHours} h</span></p>
            <p>Fuel needed: <span className="font-semibold">{result.fuelLiters} L</span></p>
            <p>Estimated cost: <span className="font-semibold">{result.totalCost}</span></p>
          </div>

          <AdventureActions
            summaryText={summaryText}
            exportFilename="route-time-cost-fuel.txt"
            enablePdf
            onSavePreset={() => savePreset(snapshot())}
            onLoadPreset={() => {
              const preset = loadPreset()
              if (!preset) return false
              setDistanceKm(preset.distanceKm)
              setAvgSpeedKph(preset.avgSpeedKph)
              setFuelEfficiencyKmPerL(preset.fuelEfficiencyKmPerL)
              setFuelPricePerL(preset.fuelPricePerL)
              setTollCost(preset.tollCost)
              setBreakMinutes(preset.breakMinutes)
              return true
            }}
            onClearPreset={() => clearPreset()}
          />
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
