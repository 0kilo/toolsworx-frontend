"use client"

import { useState } from "react"
import { AudioFilter } from "@/components/shared/audio-filter"
import { AboutDescription } from "@/components/ui/about-description"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

export default function AudioEqualizerPage() {
  const [bands, setBands] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

  const bandLabels = ['32Hz', '64Hz', '125Hz', '250Hz', '500Hz', '1kHz', '2kHz', '4kHz', '8kHz', '16kHz']

  const updateBand = (index: number, value: number[]) => {
    const newBands = [...bands]
    newBands[index] = value[0]
    setBands(newBands)
  }

  const resetEqualizer = () => {
    setBands([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  }

  const controls = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">10-Band Equalizer</Label>
        <Button variant="outline" size="sm" onClick={resetEqualizer}>
          Reset
        </Button>
      </div>
      
      <div className="grid grid-cols-5 gap-4">
        {bands.map((value, index) => (
          <div key={index} className="space-y-2">
            <Label className="text-xs text-center block">{bandLabels[index]}</Label>
            <div className="h-32 flex items-end">
              <Slider
                value={[value]}
                onValueChange={(val) => updateBand(index, val)}
                min={-20}
                max={20}
                step={1}
                orientation="vertical"
                className="h-full"
              />
            </div>
            <div className="text-xs text-center text-muted-foreground">
              {value > 0 ? '+' : ''}{value}dB
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Audio Equalizer</h1>
            <p className="text-muted-foreground">
              Adjust frequency bands to enhance your audio
            </p>
          </div>

          <AudioFilter
            title="10-Band Audio Equalizer"
            description="Upload an audio file and adjust the 10-band equalizer to enhance specific frequencies"
            filterType="equalizer"
            controls={controls}
            getOptions={() => ({ bands })}
          />

          <AboutDescription
            title="About Audio Equalizer"
            description="An audio equalizer allows you to adjust the balance between frequency components of audio signals. Perfect for enhancing music, podcasts, and voice recordings."
            sections={[
              {
                title: "Frequency Bands",
                content: [
                  "<strong>32-125Hz (Bass):</strong> Deep bass, kick drums, bass guitar fundamentals",
                  "<strong>250-500Hz (Low-Mid):</strong> Warmth, body of vocals and instruments",
                  "<strong>1-2kHz (Mid):</strong> Presence, clarity of vocals and lead instruments",
                  "<strong>4-8kHz (High-Mid):</strong> Brightness, attack of instruments",
                  "<strong>16kHz (Treble):</strong> Air, sparkle, cymbals and high harmonics"
                ]
              },
              {
                title: "EQ Tips",
                content: [
                  "Boost frequencies sparingly - cutting is often more effective",
                  "Use narrow Q (bandwidth) for problem frequencies",
                  "Use wide Q for musical enhancement",
                  "Always check your changes in context with other tracks",
                  "Trust your ears over visual feedback"
                ]
              },
              {
                title: "Common Adjustments",
                content: [
                  "<strong>Vocal Enhancement:</strong> Slight boost at 2-5kHz for presence",
                  "<strong>Bass Boost:</strong> Gentle boost at 60-100Hz for warmth",
                  "<strong>Brightness:</strong> Boost 8-12kHz for air and sparkle",
                  "<strong>Mud Removal:</strong> Cut 200-500Hz to clean up muddiness"
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