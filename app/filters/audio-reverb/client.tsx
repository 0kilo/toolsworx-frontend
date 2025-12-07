"use client"

import { useState } from "react"
import { AudioFilter } from "@/components/shared/audio-filter"
import { AboutDescription } from "@/components/ui/about-description"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import toolContent from "./audio-reverb.json"

export default function AudioreverbClient() {
  const [amount, setAmount] = useState([50])

  const controls = (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Reverb Amount</Label>
        <div className="mt-2">
          <Slider
            value={amount}
            onValueChange={setAmount}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Dry</span>
            <span>{amount[0]}%</span>
            <span>Wet</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{toolContent.pageTitle}</h1>
            <p className="text-muted-foreground">
              {toolContent.pageDescription}
            </p>
          </div>

          <AudioFilter
            title="Audio Reverb Effect"
            description="Upload an audio file and add reverb to simulate different acoustic spaces"
            filterType="reverb"
            controls={controls}
            getOptions={() => ({ amount: amount[0] })}
          />

          <AboutDescription
            title={toolContent.aboutTitle}
            description={toolContent.aboutDescription}
            sections={toolContent.sections}
          />
        </div>

        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}