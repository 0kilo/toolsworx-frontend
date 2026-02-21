"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AdventureActions } from "@/components/shared/adventure-actions"
import { useLocalPreset } from "@/lib/hooks/use-local-preset"
import toolContent from "./base-weight-optimizer.json"
import { AboutDescription } from "@/components/ui/about-description"
import { analyzeBaseWeight, type GearItem } from "@/lib/tools/logic/adventure/tool-base-weight-optimizer"

interface BaseWeightPreset {
  rawItems: string
}

function parseItems(text: string): GearItem[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, weight] = line.split(",")
      return { name: (name || "").trim(), weightKg: Number((weight || "").trim()) || 0 }
    })
}

export default function AdventureToolClient() {
  const [rawItems, setRawItems] = useState("Tent,1.8\nSleeping bag,1.1\nCook set,0.7\nWater,2.0\nFood bag,1.4")
  const { savePreset, loadPreset, clearPreset } = useLocalPreset<BaseWeightPreset>("adventure:base-weight-optimizer")

  const result = useMemo(() => analyzeBaseWeight(parseItems(rawItems)), [rawItems])

  const summaryText = useMemo(
    () =>
      `Base Weight Optimizer\nTotal: ${result.totalKg} kg\nTop items:\n${result.topItems
        .map((i) => `- ${i.name}: ${i.weightKg} kg`)
        .join("\n")}`,
    [result]
  )

  return (
    <div className="container py-8 md:py-12">
      <Card>
        <CardHeader><CardTitle>{toolContent.pageTitle}</CardTitle><CardDescription>{toolContent.pageDescription}</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Items (one per line: item,weightKg)</Label><Textarea value={rawItems} onChange={(e) => setRawItems(e.target.value)} rows={8} /></div>
          <div className="rounded-lg border p-4 text-sm space-y-2">
            <p>Total base weight: <span className="font-semibold">{result.totalKg} kg</span></p>
            <p className="font-medium">Top heavy items:</p>
            <ul className="space-y-1">{result.topItems.map((item) => <li key={item.name}>- {item.name}: {item.weightKg} kg</li>)}</ul>
          </div>
          <AdventureActions
            summaryText={summaryText}
            exportFilename="base-weight-optimizer.txt"
            onSavePreset={() => savePreset({ rawItems })}
            onLoadPreset={() => {
              const preset = loadPreset()
              if (!preset) return false
              setRawItems(preset.rawItems)
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
