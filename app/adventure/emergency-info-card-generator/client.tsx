"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AdventureActions } from "@/components/shared/adventure-actions"
import { useLocalPreset } from "@/lib/hooks/use-local-preset"
import toolContent from "./emergency-info-card-generator.json"
import { AboutDescription } from "@/components/ui/about-description"
import { generateEmergencyInfoCard } from "@/lib/tools/logic/adventure/tool-emergency-info-card-generator"

interface EmergencyPreset {
  fullName: string
  bloodType: string
  allergies: string
  emergencyContactName: string
  emergencyContactPhone: string
}

export default function AdventureToolClient() {
  const [fullName, setFullName] = useState("")
  const [bloodType, setBloodType] = useState("")
  const [allergies, setAllergies] = useState("")
  const [emergencyContactName, setEmergencyContactName] = useState("")
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("")
  const { savePreset, loadPreset, clearPreset } = useLocalPreset<EmergencyPreset>("adventure:emergency-info-card-generator")

  const card = useMemo(
    () =>
      generateEmergencyInfoCard({
        fullName,
        bloodType,
        allergies,
        emergencyContactName,
        emergencyContactPhone,
      }),
    [fullName, bloodType, allergies, emergencyContactName, emergencyContactPhone]
  )

  const summaryText = `Emergency Info Card\n${card}`

  const snapshot = (): EmergencyPreset => ({ fullName, bloodType, allergies, emergencyContactName, emergencyContactPhone })
  const applyPreset = (preset: EmergencyPreset) => {
    setFullName(preset.fullName)
    setBloodType(preset.bloodType)
    setAllergies(preset.allergies)
    setEmergencyContactName(preset.emergencyContactName)
    setEmergencyContactPhone(preset.emergencyContactPhone)
  }

  return (
    <div className="container py-8 md:py-12">
      <Card>
        <CardHeader>
          <CardTitle>{toolContent.pageTitle}</CardTitle>
          <CardDescription>{toolContent.pageDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Full name</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
            <div className="space-y-2"><Label>Blood type</Label><Input value={bloodType} onChange={(e) => setBloodType(e.target.value)} /></div>
            <div className="space-y-2"><Label>Allergies</Label><Input value={allergies} onChange={(e) => setAllergies(e.target.value)} /></div>
            <div className="space-y-2"><Label>Emergency contact name</Label><Input value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Emergency contact phone</Label><Input value={emergencyContactPhone} onChange={(e) => setEmergencyContactPhone(e.target.value)} /></div>
          </div>
          <pre className="rounded-lg border p-4 text-sm whitespace-pre-wrap">{card}</pre>
          <AdventureActions
            summaryText={summaryText}
            exportFilename="emergency-info-card.txt"
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
