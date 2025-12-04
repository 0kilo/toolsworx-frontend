"use client"

import { useState } from "react"
import { AudioFilter } from "@/components/shared/audio-filter"
import { AboutDescription } from "@/components/ui/about-description"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import toolContent from "./audio-bass-boost.json"

export default function AudioBassBoostPage() {
  const [gain, setGain] = useState([5])

  const controls = (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Bass Gain</Label>
        <div className="mt-2">
          <Slider
            value={gain}
            onValueChange={setGain}
            min={0}
            max={20}
            step={1}
            className="w-full"
          />
          <div className="text-center text-xs text-muted-foreground mt-1">
            +{gain[0]}dB
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
            title="Audio Bass Boost"
            description="Upload an audio file and boost bass frequencies for a fuller, more powerful sound"
            filterType="bass-boost"
            controls={controls}
            getOptions={() => ({ gain: gain[0] })}
          />

          <AboutDescription
            title={toolContent.aboutTitle}
            description={toolContent.aboutDescription}
            sections={toolContent.sections}
          />
        </div>
        <div className="lg:col-span-1"></div>
      </div>
    </div>
  )
}