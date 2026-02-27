"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ListChecks, Weight } from "lucide-react"
import { AdventureActions } from "@/components/shared/adventure-actions"
import { useLocalPreset } from "@/lib/hooks/use-local-preset"
import toolContent from "./packing-list-optimizer.json"
import { AboutDescription } from "@/components/ui/about-description"
import {
  generatePackingList,
  analyzeBaseWeight,
  parseGearItems,
  type GearItem,
} from "@/lib/tools/logic/adventure/tool-packing-list-optimizer"

interface PackingPreset {
  tripType: "travel" | "camping" | "motorcycle" | "backpacking"
  days: string
  tempC: string
  rainy: boolean
  rawItems: string
}

const DEFAULT_GEAR_ITEMS = `Tent,1.8,shelter
Sleeping bag,1.2,sleep
Sleeping pad,0.5,sleep
Backpack,1.5,pack
Stove,0.3,cooking
Fuel,0.4,cooking
Pot,0.4,cooking
Water filter,0.3,hydration
First aid kit,0.3,safety
Headlamp,0.1,electronics
Clothing,1.0,clothing
Rain jacket,0.4,clothing`

export default function PackingListOptimizerClient() {
  const [activeTab, setActiveTab] = useState<"builder" | "optimizer">("builder")

  // Packing List Builder state
  const [tripType, setTripType] = useState<"travel" | "camping" | "motorcycle" | "backpacking">("camping")
  const [days, setDays] = useState("3")
  const [tempC, setTempC] = useState("14")
  const [rainy, setRainy] = useState(false)

  // Weight Optimizer state
  const [rawItems, setRawItems] = useState(DEFAULT_GEAR_ITEMS)

  const { savePreset, loadPreset, clearPreset } = useLocalPreset<PackingPreset>("adventure:packing-list-optimizer")

  const packingResult = useMemo(() => generatePackingList({
    tripType,
    days: Number(days) || 1,
    tempC: Number(tempC) || 15,
    rainy,
  }), [tripType, days, tempC, rainy])

  const weightResult = useMemo(() => analyzeBaseWeight(parseGearItems(rawItems)), [rawItems])

  const packingSummary = `Packing List\nType: ${tripType}\nDays: ${days}\nTemp: ${tempC}°C\nRain: ${rainy ? "Yes" : "No"}\nItems: ${packingResult.items.length}\nEst. Weight: ${packingResult.totalWeightKg} kg`

  const weightSummary = `Weight Analysis\nTotal: ${weightResult.totalKg} kg\nUltralight: ${weightResult.ultralight ? "Yes" : "No"}\nTop item: ${weightResult.topItems[0]?.name || "N/A"} (${weightResult.topItems[0]?.weightKg} kg)`

  return (
    <div className="container py-8 md:py-12">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="h-5 w-5" />
            {toolContent.title}
          </CardTitle>
          <CardDescription>{toolContent.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="builder">
                <ListChecks className="h-4 w-4 mr-2" />
                Packing List Builder
              </TabsTrigger>
              <TabsTrigger value="optimizer">
                <Weight className="h-4 w-4 mr-2" />
                Weight Optimizer
              </TabsTrigger>
            </TabsList>

            {/* Packing List Builder Tab */}
            <TabsContent value="builder" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Trip type</Label>
                  <Select value={tripType} onValueChange={(v) => {
                    if (v === "travel" || v === "camping" || v === "motorcycle" || v === "backpacking") {
                      setTripType(v)
                    }
                  }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="camping">Camping</SelectItem>
                      <SelectItem value="motorcycle">Motorcycle</SelectItem>
                      <SelectItem value="backpacking">Backpacking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Days</Label>
                  <Input value={days} onChange={(e) => setDays(e.target.value)} inputMode="numeric" />
                </div>
                <div className="space-y-2">
                  <Label>Average temp (°C)</Label>
                  <Input value={tempC} onChange={(e) => setTempC(e.target.value)} inputMode="decimal" />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Checkbox checked={rainy} onCheckedChange={(v) => setRainy(Boolean(v))} />
                  <Label>Rain expected</Label>
                </div>
              </div>

              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Generated Packing List ({packingResult.items.length} items)</h4>
                  <span className="text-sm text-muted-foreground">Est. Weight: {packingResult.totalWeightKg} kg</span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {packingResult.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-muted-foreground mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>

                {packingResult.topHeavyItems.length > 0 && (
                  <div className="pt-4 border-t">
                    <h5 className="font-semibold text-sm mb-2">Heaviest Items (Estimated)</h5>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                      {packingResult.topHeavyItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="text-muted-foreground truncate">{item.name}</span>
                          <span className="font-medium">{item.weightKg} kg</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <AdventureActions
                summaryText={packingSummary}
                exportFilename="packing-list.txt"
                enablePdf
                onSavePreset={() => savePreset({ tripType, days, tempC, rainy, rawItems })}
                onLoadPreset={() => {
                  const preset = loadPreset()
                  if (!preset) return false
                  setTripType(preset.tripType)
                  setDays(preset.days)
                  setTempC(preset.tempC)
                  setRainy(preset.rainy)
                  setRawItems(preset.rawItems)
                  return true
                }}
                onClearPreset={() => clearPreset()}
              />
            </TabsContent>

            {/* Weight Optimizer Tab */}
            <TabsContent value="optimizer" className="space-y-4">
              <div className="space-y-2">
                <Label>Gear Items (one per line: name, weight in kg, category)</Label>
                <Textarea
                  value={rawItems}
                  onChange={(e) => setRawItems(e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>

              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Weight Analysis</h4>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{weightResult.totalKg} kg</div>
                    <div className="text-sm text-muted-foreground">
                      {weightResult.ultralight ? "🏆 Ultralight" : weightResult.lightweight ? "✓ Lightweight" : "Traditional"}
                    </div>
                  </div>
                </div>

                {weightResult.topItems.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-sm mb-2">Top 5 Heaviest Items</h5>
                    <div className="space-y-1">
                      {weightResult.topItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{idx + 1}. {item.name}</span>
                          <span className="font-medium">{item.weightKg} kg</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {Object.keys(weightResult.categoryBreakdown).length > 0 && (
                  <div>
                    <h5 className="font-semibold text-sm mb-2">Weight by Category</h5>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                      {Object.entries(weightResult.categoryBreakdown)
                        .sort((a, b) => b[1] - a[1])
                        .map(([category, weight]) => (
                          <div key={category} className="flex justify-between">
                            <span className="text-muted-foreground capitalize">{category}</span>
                            <span className="font-medium">{Math.round(weight * 10) / 10} kg</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <AdventureActions
                summaryText={weightSummary}
                exportFilename="gear-weight-analysis.txt"
                enablePdf
                onSavePreset={() => savePreset({ tripType, days, tempC, rainy, rawItems })}
                onLoadPreset={() => {
                  const preset = loadPreset()
                  if (!preset) return false
                  setTripType(preset.tripType)
                  setDays(preset.days)
                  setTempC(preset.tempC)
                  setRainy(preset.rainy)
                  setRawItems(preset.rawItems)
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
