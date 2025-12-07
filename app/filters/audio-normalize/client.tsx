"use client"

import { AudioFilter } from "@/components/shared/audio-filter"
import { AboutDescription } from "@/components/ui/about-description"
import toolContent from "./audio-normalize.json"

export default function AudionormalizeClient() {
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
            title="Audio Normalization"
            description="Upload an audio file to automatically normalize levels for optimal loudness and consistency"
            filterType="normalize"
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