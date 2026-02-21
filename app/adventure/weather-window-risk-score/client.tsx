"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AdventureActions } from "@/components/shared/adventure-actions"
import { useLocalPreset } from "@/lib/hooks/use-local-preset"
import toolContent from "./weather-window-risk-score.json"
import { AboutDescription } from "@/components/ui/about-description"
import { calculateWeatherWindowRisk } from "@/lib/tools/logic/adventure/tool-weather-window-risk-score"

interface WeatherPreset {
  precipProbability: string
  windKph: string
  lowTempC: string
  highTempC: string
}

export default function AdventureToolClient() {
  const [precipProbability, setPrecipProbability] = useState("35")
  const [windKph, setWindKph] = useState("18")
  const [lowTempC, setLowTempC] = useState("8")
  const [highTempC, setHighTempC] = useState("21")
  const { savePreset, loadPreset, clearPreset } = useLocalPreset<WeatherPreset>("adventure:weather-window-risk-score")

  const result = useMemo(
    () =>
      calculateWeatherWindowRisk({
        precipProbability: Number(precipProbability) || 0,
        windKph: Number(windKph) || 0,
        lowTempC: Number(lowTempC) || 0,
        highTempC: Number(highTempC) || 0,
      }),
    [precipProbability, windKph, lowTempC, highTempC]
  )

  const summaryText = useMemo(
    () =>
      `Weather Window Risk Score\nPrecip: ${precipProbability}%\nWind: ${windKph} km/h\nLow/High: ${lowTempC}C / ${highTempC}C\nScore: ${result.score}/100 (${result.level})`,
    [precipProbability, windKph, lowTempC, highTempC, result]
  )

  const snapshot = (): WeatherPreset => ({ precipProbability, windKph, lowTempC, highTempC })
  const applyPreset = (preset: WeatherPreset) => {
    setPrecipProbability(preset.precipProbability)
    setWindKph(preset.windKph)
    setLowTempC(preset.lowTempC)
    setHighTempC(preset.highTempC)
  }

  return (
    <div className="container py-8 md:py-12">
      <Card>
        <CardHeader>
          <CardTitle>{toolContent.pageTitle}</CardTitle>
          <CardDescription>{toolContent.pageDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Precipitation probability (%)</Label>
              <Input value={precipProbability} onChange={(e) => setPrecipProbability(e.target.value)} inputMode="decimal" />
            </div>
            <div className="space-y-2">
              <Label>Wind (km/h)</Label>
              <Input value={windKph} onChange={(e) => setWindKph(e.target.value)} inputMode="decimal" />
            </div>
            <div className="space-y-2">
              <Label>Low temp (C)</Label>
              <Input value={lowTempC} onChange={(e) => setLowTempC(e.target.value)} inputMode="decimal" />
            </div>
            <div className="space-y-2">
              <Label>High temp (C)</Label>
              <Input value={highTempC} onChange={(e) => setHighTempC(e.target.value)} inputMode="decimal" />
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Risk score</p>
            <p className="text-2xl font-semibold">{result.score} / 100 ({result.level})</p>
          </div>
          <AdventureActions
            summaryText={summaryText}
            exportFilename="weather-window-risk-score.txt"
        enablePdf
            onSavePreset={() => savePreset(snapshot())}
            onLoadPreset={() => {
              const preset = loadPreset()
              if (!preset) return false
              applyPreset(preset)
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
