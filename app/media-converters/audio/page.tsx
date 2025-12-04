"use client"

import { MediaConverter } from "@/components/shared/media-converter"
import { AboutDescription } from "@/components/ui/about-description"
import toolContent from "./audio.json"

const audioFormats = [
  { value: 'mp3', label: 'MP3', extensions: ['mp3'], accept: '.mp3,audio/mpeg' },
  { value: 'wav', label: 'WAV', extensions: ['wav'], accept: '.wav,audio/wav' },
  { value: 'flac', label: 'FLAC', extensions: ['flac'], accept: '.flac,audio/flac' },
  { value: 'aac', label: 'AAC', extensions: ['aac'], accept: '.aac,audio/aac' },
  { value: 'ogg', label: 'OGG', extensions: ['ogg'], accept: '.ogg,audio/ogg' },
  { value: 'm4a', label: 'M4A', extensions: ['m4a'], accept: '.m4a,audio/mp4' }
]

export default function AudioConverterPage() {
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

          <MediaConverter
            title="Audio Format Converter"
            description="Convert between different audio formats with quality control"
            fromFormats={audioFormats}
            toFormats={audioFormats}
            defaultFrom="wav"
            defaultTo="mp3"
            maxSize={200}
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