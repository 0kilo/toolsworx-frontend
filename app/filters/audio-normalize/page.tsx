"use client"

import { AudioFilter } from "@/components/shared/audio-filter"
import { AboutDescription } from "@/components/ui/about-description"

export default function AudioNormalizePage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Normalize Audio</h1>
            <p className="text-muted-foreground">
              Optimize audio levels for consistent loudness
            </p>
          </div>

          <AudioFilter
            title="Audio Normalization"
            description="Upload an audio file to automatically normalize levels for optimal loudness and consistency"
            filterType="normalize"
          />

          <AboutDescription
            title="About Audio Normalization"
            description="Audio normalization adjusts the overall level of audio to achieve consistent loudness standards, making your audio sound professional and broadcast-ready."
            sections={[
              {
                title: "What Normalization Does",
                content: [
                  "Adjusts peak levels to optimal ranges",
                  "Ensures consistent loudness across tracks",
                  "Prevents clipping and distortion",
                  "Meets broadcast and streaming standards",
                  "Improves dynamic range and clarity"
                ]
              },
              {
                title: "When to Normalize",
                content: [
                  "Before uploading to streaming platforms",
                  "When mixing multiple audio sources",
                  "For podcast and broadcast content",
                  "To match levels in audio compilations",
                  "Before mastering and final output"
                ]
              },
              {
                title: "Loudness Standards",
                content: [
                  "<strong>Streaming:</strong> -14 LUFS for Spotify, Apple Music",
                  "<strong>Broadcast:</strong> -23 LUFS for TV, -16 LUFS for radio",
                  "<strong>Podcasts:</strong> -16 to -20 LUFS recommended",
                  "<strong>YouTube:</strong> -14 LUFS target level"
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