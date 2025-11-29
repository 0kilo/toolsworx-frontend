"use client"

import { useState } from "react"
import { AudioFilter } from "@/components/shared/audio-filter"
import { AboutDescription } from "@/components/ui/about-description"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

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
            <h1 className="text-3xl font-bold mb-2">Echo Effect</h1>
            <p className="text-muted-foreground">
              Add echo with adjustable delay and decay
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
            title="About Echo Effect"
            description="Echo creates distinct repetitions of the original sound with adjustable delay time and decay rate. Perfect for creating depth and rhythmic interest in audio."
            sections={[
              {
                title: "Echo Parameters",
                content: [
                  "<strong>Delay Time:</strong> Time between original sound and echo (100-2000ms)",
                  "<strong>Decay Rate:</strong> How quickly each echo fades out",
                  "<strong>Feedback:</strong> Amount of echo fed back to create multiple repeats",
                  "<strong>Mix Level:</strong> Balance between dry and wet signal"
                ]
              },
              {
                title: "Creative Uses",
                content: [
                  "Vocals: Create dramatic effects or simulate large spaces",
                  "Guitars: Classic slapback echo for rockabilly and country",
                  "Drums: Add rhythmic interest to snare hits",
                  "Sound Design: Create sci-fi and atmospheric effects",
                  "Dub Music: Essential for reggae and dub production"
                ]
              }
            ]}
          />
        </div>
        <div className="lg:col-span-1"></div>
      </div>
    </div>
  )
}