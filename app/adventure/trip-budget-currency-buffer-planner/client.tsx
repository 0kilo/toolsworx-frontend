"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AdventureActions } from "@/components/shared/adventure-actions"
import { useLocalPreset } from "@/lib/hooks/use-local-preset"
import toolContent from "./trip-budget-currency-buffer-planner.json"
import { AboutDescription } from "@/components/ui/about-description"
import { calculateBudgetWithBuffer } from "@/lib/tools/logic/adventure/tool-trip-budget-currency-buffer-planner"

interface BudgetPreset {
  days: string
  dailyBudgetHome: string
  fixedCostsHome: string
  exchangeRateLocalPerHome: string
  fxBufferPercent: string
}

export default function AdventureToolClient() {
  const [days, setDays] = useState("7")
  const [dailyBudgetHome, setDailyBudgetHome] = useState("120")
  const [fixedCostsHome, setFixedCostsHome] = useState("450")
  const [exchangeRateLocalPerHome, setExchangeRateLocalPerHome] = useState("0.92")
  const [fxBufferPercent, setFxBufferPercent] = useState("8")
  const { savePreset, loadPreset, clearPreset } = useLocalPreset<BudgetPreset>("adventure:trip-budget-currency-buffer-planner")

  const result = useMemo(() => calculateBudgetWithBuffer({
    days: Number(days) || 0,
    dailyBudgetHome: Number(dailyBudgetHome) || 0,
    fixedCostsHome: Number(fixedCostsHome) || 0,
    exchangeRateLocalPerHome: Number(exchangeRateLocalPerHome) || 0,
    fxBufferPercent: Number(fxBufferPercent) || 0,
  }), [days, dailyBudgetHome, fixedCostsHome, exchangeRateLocalPerHome, fxBufferPercent])

  const summaryText = `Trip Budget with FX Buffer\nBase total: ${result.totalHome}\nBuffered home: ${result.bufferedHome}\nBuffered local: ${result.bufferedLocal}`

  return (
    <div className="container py-8 md:py-12"><Card><CardHeader><CardTitle>{toolContent.pageTitle}</CardTitle><CardDescription>{toolContent.pageDescription}</CardDescription></CardHeader><CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2"><Label>Days</Label><Input value={days} onChange={(e) => setDays(e.target.value)} inputMode="numeric" /></div>
        <div className="space-y-2"><Label>Daily budget (home)</Label><Input value={dailyBudgetHome} onChange={(e) => setDailyBudgetHome(e.target.value)} inputMode="decimal" /></div>
        <div className="space-y-2"><Label>Fixed costs (home)</Label><Input value={fixedCostsHome} onChange={(e) => setFixedCostsHome(e.target.value)} inputMode="decimal" /></div>
        <div className="space-y-2"><Label>FX rate (local per home)</Label><Input value={exchangeRateLocalPerHome} onChange={(e) => setExchangeRateLocalPerHome(e.target.value)} inputMode="decimal" /></div>
        <div className="space-y-2"><Label>Buffer (%)</Label><Input value={fxBufferPercent} onChange={(e) => setFxBufferPercent(e.target.value)} inputMode="decimal" /></div>
      </div>
      <div className="rounded-lg border p-4 text-sm space-y-1">
        <p>Base total (home): <span className="font-semibold">{result.totalHome}</span></p>
        <p>Buffered total (home): <span className="font-semibold">{result.bufferedHome}</span></p>
        <p>Buffered total (local): <span className="font-semibold">{result.bufferedLocal}</span></p>
      </div>
      <AdventureActions
        summaryText={summaryText}
        exportFilename="trip-budget-fx-buffer.txt"
        enablePdf
        onSavePreset={() => savePreset({ days, dailyBudgetHome, fixedCostsHome, exchangeRateLocalPerHome, fxBufferPercent })}
        onLoadPreset={() => {
          const preset = loadPreset()
          if (!preset) return false
          setDays(preset.days)
          setDailyBudgetHome(preset.dailyBudgetHome)
          setFixedCostsHome(preset.fixedCostsHome)
          setExchangeRateLocalPerHome(preset.exchangeRateLocalPerHome)
          setFxBufferPercent(preset.fxBufferPercent)
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
