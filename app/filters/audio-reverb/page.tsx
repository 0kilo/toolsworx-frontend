"use client"

import { useState } from "react"
import { AudioFilter } from "@/components/shared/audio-filter"
import { AboutDescription } from "@/components/ui/about-description"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function AudioReverbPage() {
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
            <h1 className="text-3xl font-bold mb-2">Reverb Effect</h1>
            <p className="text-muted-foreground">
              Add natural reverb to create space and depth
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
            title="About Reverb Effect"
            description="Reverb simulates the natural echo that occurs when sound reflects off surfaces in an acoustic space. It adds depth, warmth, and spatial dimension to audio recordings."
            sections={[
              {
                title: "When to Use Reverb",
                content: [
                  "Vocals: Add warmth and presence to dry vocal recordings",
                  "Instruments: Create spatial depth for guitars, pianos, and drums",
                  "Podcasts: Subtle reverb can make voices sound more natural",
                  "Music Production: Blend instruments together in a mix",
                  "Sound Design: Create atmospheric and cinematic effects"
                ]
              },
              {
                title: "Reverb Types",
                content: [
                  "<strong>Room Reverb:</strong> Simulates small to medium rooms",
                  "<strong>Hall Reverb:</strong> Large concert hall acoustics",
                  "<strong>Plate Reverb:</strong> Vintage mechanical reverb sound",
                  "<strong>Spring Reverb:</strong> Classic guitar amp reverb",
                  "<strong>Chamber Reverb:</strong> Echo chamber acoustics"
                ]
              },
              {
                title: "Tips for Using Reverb",
                content: [
                  "Less is often more - start with subtle amounts",
                  "Use pre-delay to separate the dry signal from reverb",
                  "High-cut the reverb to avoid muddiness",
                  "Match reverb time to the tempo of your music",
                  "Use different reverb settings for different instruments"
                ]
              }
            ]}
          />
        </div>

        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}