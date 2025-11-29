"use client"

import { AudioFilter } from "@/components/shared/audio-filter"
import { AboutDescription } from "@/components/ui/about-description"

export default function AudioNoiseReductionPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Noise Reduction</h1>
            <p className="text-muted-foreground">
              Remove background noise and improve audio clarity
            </p>
          </div>

          <AudioFilter
            title="Audio Noise Reduction"
            description="Upload an audio file to automatically reduce background noise and improve clarity"
            filterType="noise-reduction"
          />

          <AboutDescription
            title="About Noise Reduction"
            description="Noise reduction removes unwanted background sounds like hiss, hum, and environmental noise while preserving the quality of the main audio content."
            sections={[
              {
                title: "What It Removes",
                content: [
                  "Background hiss from recordings",
                  "Air conditioning and fan noise", 
                  "Electrical hum and buzz",
                  "Wind noise from outdoor recordings",
                  "Room tone and ambient noise"
                ]
              },
              {
                title: "Best Practices",
                content: [
                  "Record in quiet environments when possible",
                  "Use noise reduction sparingly to avoid artifacts",
                  "Apply before other processing effects",
                  "Check results with headphones for quality",
                  "Consider the trade-off between noise removal and audio quality"
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