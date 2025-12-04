"use client"

import { useState } from "react"
import { AudioFilter } from "@/components/shared/audio-filter"
import { AboutDescription } from "@/components/ui/about-description"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import toolContent from "./audio-echo.json"

export default function AudioEchoPage() {
  const [delay, setDelay] = useState([500])
  const [decay, setDecay] = useState([50])

  const controls = (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Echo Delay (ms)</Label>
        <div className="mt-2">
          <Slider
            value={delay}
            onValueChange={setDelay}
            min={100}
            max={2000}
            step={50}
            className="w-full"
          />
          <div className="text-center text-xs text-muted-foreground mt-1">
            {delay[0]}ms
          </div>
        </div>
      </div>
      
      <div>
        <Label className="text-sm font-medium">Echo Decay</Label>
        <div className="mt-2">
          <Slider
            value={decay}
            onValueChange={setDecay}
            min={10}
            max={90}
            step={5}
            className="w-full"
          />
          <div className="text-center text-xs text-muted-foreground mt-1">
            {decay[0]}%
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
            title="Audio Echo Effect"
            description="Upload an audio file and add echo with customizable delay and decay settings"
            filterType="echo"
            controls={controls}
            getOptions={() => ({ delay: delay[0], decay: decay[0] / 100 })}
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