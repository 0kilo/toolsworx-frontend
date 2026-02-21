"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { AdventureActions } from "@/components/shared/adventure-actions"
import { useLocalPreset } from "@/lib/hooks/use-local-preset"
import toolContent from "./offline-packing-checklist-exporter.json"
import { AboutDescription } from "@/components/ui/about-description"
import { buildPackingChecklist } from "@/lib/tools/logic/adventure/tool-offline-packing-checklist-exporter"

interface PackingPreset {
  tripType: "travel" | "camping" | "motorcycle" | "backpacking"
  days: string
  rainy: boolean
}

export default function AdventureToolClient() {
  const [tripType, setTripType] = useState<"travel" | "camping" | "motorcycle" | "backpacking">("travel")
  const [days, setDays] = useState("3")
  const [rainy, setRainy] = useState(false)
  const { savePreset, loadPreset, clearPreset } = useLocalPreset<PackingPreset>("adventure:offline-packing-checklist-exporter")

  const items = useMemo(() => buildPackingChecklist({ tripType, days: Number(days) || 1, rainy }), [tripType, days, rainy])
  const summaryText = `Offline Packing Checklist\nType: ${tripType}\nDays: ${days}\nRain: ${rainy ? "Yes" : "No"}\n\n${items.map((i) => `- ${i}`).join("\n")}`

  return (
    <div className="container py-8 md:py-12">
      <Card>
        <CardHeader><CardTitle>{toolContent.pageTitle}</CardTitle><CardDescription>{toolContent.pageDescription}</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2"><Label>Trip type</Label><Select value={tripType} onValueChange={(v) => {
              if (v === "travel" || v === "camping" || v === "motorcycle" || v === "backpacking") {
                setTripType(v)
              }
            }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="travel">Travel</SelectItem><SelectItem value="camping">Camping</SelectItem><SelectItem value="motorcycle">Motorcycle</SelectItem><SelectItem value="backpacking">Backpacking</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Days</Label><Input value={days} onChange={(e) => setDays(e.target.value)} inputMode="numeric" /></div>
            <div className="flex items-center gap-2"><Checkbox checked={rainy} onCheckedChange={(v) => setRainy(Boolean(v))} /><Label>Rain expected</Label></div>
          </div>
          <ul className="rounded-lg border p-4 text-sm space-y-1">{items.map((item) => <li key={item}>- {item}</li>)}</ul>
          <AdventureActions
            summaryText={summaryText}
            exportFilename="offline-packing-checklist.txt"
            onSavePreset={() => savePreset({ tripType, days, rainy })}
            onLoadPreset={() => {
              const preset = loadPreset()
              if (!preset) return false
              setTripType(preset.tripType)
              setDays(preset.days)
              setRainy(preset.rainy)
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
