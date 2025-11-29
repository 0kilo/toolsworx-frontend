"use client"

import { useState } from "react"
import { AudioFilter } from "@/components/shared/audio-filter"
import { AboutDescription } from "@/components/ui/about-description"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

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
            <h1 className="text-3xl font-bold mb-2">Bass Boost</h1>
            <p className="text-muted-foreground">
              Enhance low frequencies for deeper, richer sound
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
            title="About Bass Boost"
            description="Bass boost enhances low-frequency content (typically 20-250Hz) to add warmth, power, and depth to your audio. Perfect for music, podcasts, and sound design."
            sections={[
              {
                title: "Bass Frequency Ranges",
                content: [
                  "<strong>Sub-bass (20-60Hz):</strong> Deep rumble, felt more than heard",
                  "<strong>Bass (60-110Hz):</strong> Fundamental bass notes, kick drums",
                  "<strong>Low-mid (110-250Hz):</strong> Warmth, body of bass instruments",
                  "<strong>Upper bass (250-500Hz):</strong> Punch and presence"
                ]
              },
              {
                title: "When to Use Bass Boost",
                content: [
                  "Music with weak or thin bass response",
                  "Podcasts and voice recordings lacking warmth",
                  "Audio played on small speakers or headphones",
                  "Electronic music and hip-hop production",
                  "Sound design for impact and power"
                ]
              },
              {
                title: "Bass Boost Tips",
                content: [
                  "Start with small amounts (3-6dB) and adjust to taste",
                  "Be careful not to muddy the mix with too much boost",
                  "Consider the playback system - some have natural bass emphasis",
                  "Use high-pass filtering to remove unwanted sub-sonic content",
                  "Monitor on different speakers to check translation"
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