"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, Calculator } from "lucide-react"
import { AdventureActions } from "@/components/shared/adventure-actions"
import { useLocalPreset } from "@/lib/hooks/use-local-preset"
import toolContent from "./trip-budget-planner.json"
import { AboutDescription } from "@/components/ui/about-description"
import { calculateTripBudget, calculateQuickBudget } from "@/lib/tools/logic/adventure/tool-trip-budget-planner"

interface BudgetPreset {
  mode: string
  days: string
  fuelPerDay: string
  lodgingPerDay: string
  mealsPerDay: string
  activitiesPerDay: string
  miscPerDay: string
  fixedCosts: string
  exchangeRateLocalPerHome: string
  bufferPercent: string
  dailyBudget: string
}

export default function TripBudgetPlannerClient() {
  const [activeTab, setActiveTab] = useState<"detailed" | "quick">("detailed")

  // Detailed budget state
  const [days, setDays] = useState("7")
  const [fuelPerDay, setFuelPerDay] = useState("28")
  const [lodgingPerDay, setLodgingPerDay] = useState("80")
  const [mealsPerDay, setMealsPerDay] = useState("35")
  const [activitiesPerDay, setActivitiesPerDay] = useState("25")
  const [miscPerDay, setMiscPerDay] = useState("15")
  const [fixedCosts, setFixedCosts] = useState("450")
  const [exchangeRateLocalPerHome, setExchangeRateLocalPerHome] = useState("0.92")
  const [bufferPercent, setBufferPercent] = useState("10")

  // Quick budget state
  const [quickDays, setQuickDays] = useState("7")
  const [dailyBudget, setDailyBudget] = useState("150")
  const [quickFixedCosts, setQuickFixedCosts] = useState("450")

  const { savePreset, loadPreset, clearPreset } = useLocalPreset<BudgetPreset>("adventure:trip-budget-planner")

  // Detailed budget calculation
  const budgetResult = useMemo(() => calculateTripBudget({
    days: Number(days) || 0,
    fuelPerDay: Number(fuelPerDay) || 0,
    lodgingPerDay: Number(lodgingPerDay) || 0,
    mealsPerDay: Number(mealsPerDay) || 0,
    activitiesPerDay: Number(activitiesPerDay) || 0,
    miscPerDay: Number(miscPerDay) || 0,
    fixedCosts: Number(fixedCosts) || 0,
    exchangeRateLocalPerHome: Number(exchangeRateLocalPerHome) || 1,
    bufferPercent: Number(bufferPercent) || 0,
  }), [days, fuelPerDay, lodgingPerDay, mealsPerDay, activitiesPerDay, miscPerDay, fixedCosts, exchangeRateLocalPerHome, bufferPercent])

  // Quick budget calculation
  const quickResult = useMemo(() => calculateQuickBudget({
    days: Number(quickDays) || 0,
    dailyBudget: Number(dailyBudget) || 0,
    fixedCosts: Number(quickFixedCosts) || 0,
  }), [quickDays, dailyBudget, quickFixedCosts])

  const detailedSummary = `Trip Budget\nDays: ${days}\nDaily: ${budgetResult.perDayHome}\nFixed: ${budgetResult.fixedCostsHome}\nBase Total: ${budgetResult.baseTotalHome}\nBuffered Total: ${budgetResult.bufferedTotalHome}`

  const quickSummary = `Quick Budget\nDays: ${quickDays}\nDaily: ${dailyBudget}\nTotal: ${quickResult.totalWithFixed}`

  return (
    <div className="container py-8 md:py-12">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            {toolContent.title}
          </CardTitle>
          <CardDescription>{toolContent.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="detailed">
                <Calculator className="h-4 w-4 mr-2" />
                Detailed Budget
              </TabsTrigger>
              <TabsTrigger value="quick">
                <Wallet className="h-4 w-4 mr-2" />
                Quick Budget
              </TabsTrigger>
            </TabsList>

            {/* Detailed Budget Tab */}
            <TabsContent value="detailed" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Trip Duration (days)</Label>
                    <Input value={days} onChange={(e) => setDays(e.target.value)} inputMode="numeric" />
                  </div>
                  <div className="space-y-2">
                    <Label>Buffer (%)</Label>
                    <Input value={bufferPercent} onChange={(e) => setBufferPercent(e.target.value)} inputMode="decimal" />
                  </div>
                  <div className="space-y-2">
                    <Label>Exchange Rate (local per 1 home)</Label>
                    <Input value={exchangeRateLocalPerHome} onChange={(e) => setExchangeRateLocalPerHome(e.target.value)} inputMode="decimal" />
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Daily Expenses</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Fuel/Transport</Label>
                      <Input value={fuelPerDay} onChange={(e) => setFuelPerDay(e.target.value)} inputMode="decimal" />
                    </div>
                    <div className="space-y-2">
                      <Label>Lodging</Label>
                      <Input value={lodgingPerDay} onChange={(e) => setLodgingPerDay(e.target.value)} inputMode="decimal" />
                    </div>
                    <div className="space-y-2">
                      <Label>Meals</Label>
                      <Input value={mealsPerDay} onChange={(e) => setMealsPerDay(e.target.value)} inputMode="decimal" />
                    </div>
                    <div className="space-y-2">
                      <Label>Activities</Label>
                      <Input value={activitiesPerDay} onChange={(e) => setActivitiesPerDay(e.target.value)} inputMode="decimal" />
                    </div>
                    <div className="space-y-2">
                      <Label>Miscellaneous</Label>
                      <Input value={miscPerDay} onChange={(e) => setMiscPerDay(e.target.value)} inputMode="decimal" />
                    </div>
                    <div className="flex items-end">
                      <div className="text-sm text-muted-foreground">
                        Total per day: <span className="font-semibold text-lg">{budgetResult.perDayHome}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Fixed Costs (flights, insurance, etc.)</Label>
                  <Input value={fixedCosts} onChange={(e) => setFixedCosts(e.target.value)} inputMode="decimal" />
                </div>
              </div>

              <div className="rounded-lg border p-4 space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Daily Total</div>
                    <div className="text-xl font-bold">{budgetResult.dailyTotalHome}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Fixed Costs</div>
                    <div className="text-xl font-bold">{budgetResult.fixedCostsHome}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Base Total</div>
                    <div className="text-xl font-bold">{budgetResult.baseTotalHome}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Buffer ({bufferPercent}%)</div>
                    <div className="text-xl font-bold">{budgetResult.bufferAmountHome}</div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-muted-foreground">Total with Buffer (Home)</div>
                      <div className="text-3xl font-bold">{budgetResult.bufferedTotalHome}</div>
                    </div>
                    {Number(exchangeRateLocalPerHome) !== 1 && (
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Total (Local)</div>
                        <div className="text-2xl font-bold">{budgetResult.bufferedTotalLocal}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h5 className="font-semibold text-sm mb-2">Category Breakdown</h5>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                    {Object.entries(budgetResult.categoryBreakdown).map(([category, amount]) => (
                      <div key={category} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">{category}</span>
                        <span className="font-medium">{amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <AdventureActions
                summaryText={detailedSummary}
                exportFilename="trip-budget.txt"
                enablePdf
                onSavePreset={() => savePreset({
                  mode: "detailed", days, fuelPerDay, lodgingPerDay, mealsPerDay,
                  activitiesPerDay, miscPerDay, fixedCosts, exchangeRateLocalPerHome, bufferPercent, dailyBudget
                })}
                onLoadPreset={() => {
                  const preset = loadPreset()
                  if (!preset) return false
                  setDays(preset.days)
                  setFuelPerDay(preset.fuelPerDay)
                  setLodgingPerDay(preset.lodgingPerDay)
                  setMealsPerDay(preset.mealsPerDay)
                  setActivitiesPerDay(preset.activitiesPerDay)
                  setMiscPerDay(preset.miscPerDay)
                  setFixedCosts(preset.fixedCosts)
                  setExchangeRateLocalPerHome(preset.exchangeRateLocalPerHome)
                  setBufferPercent(preset.bufferPercent)
                  setDailyBudget(preset.dailyBudget)
                  return true
                }}
                onClearPreset={() => clearPreset()}
              />
            </TabsContent>

            {/* Quick Budget Tab */}
            <TabsContent value="quick" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Trip Duration (days)</Label>
                  <Input value={quickDays} onChange={(e) => setQuickDays(e.target.value)} inputMode="numeric" />
                </div>
                <div className="space-y-2">
                  <Label>Daily Budget</Label>
                  <Input value={dailyBudget} onChange={(e) => setDailyBudget(e.target.value)} inputMode="decimal" />
                </div>
                <div className="space-y-2">
                  <Label>Fixed Costs</Label>
                  <Input value={quickFixedCosts} onChange={(e) => setQuickFixedCosts(e.target.value)} inputMode="decimal" />
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Daily Total</div>
                    <div className="text-xl font-bold">{quickResult.dailyTotal}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Fixed Costs</div>
                    <div className="text-xl font-bold">{quickResult.fixedCosts}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Grand Total</div>
                    <div className="text-2xl font-bold">{quickResult.totalWithFixed}</div>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t">
                  <div className="text-sm text-muted-foreground">Average Per Day (with fixed costs)</div>
                  <div className="text-lg font-semibold">{quickResult.perDay}</div>
                </div>
              </div>

              <AdventureActions
                summaryText={quickSummary}
                exportFilename="quick-budget.txt"
                enablePdf
                onSavePreset={() => savePreset({
                  mode: "quick", days: quickDays, fuelPerDay, lodgingPerDay, mealsPerDay,
                  activitiesPerDay, miscPerDay, fixedCosts: quickFixedCosts, exchangeRateLocalPerHome, bufferPercent, dailyBudget
                })}
                onLoadPreset={() => {
                  const preset = loadPreset()
                  if (!preset) return false
                  setQuickDays(preset.days)
                  setDailyBudget(preset.dailyBudget)
                  setQuickFixedCosts(preset.fixedCosts)
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
