"use client"

import { MediaConverter } from "@/components/shared/media-converter"
import { AboutDescription } from "@/components/ui/about-description"

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
            <h1 className="text-3xl font-bold mb-2">Audio Converter</h1>
            <p className="text-muted-foreground">
              Convert between MP3, WAV, FLAC, AAC, and other audio formats
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
            title="About Audio Conversion"
            description="Convert audio files between popular formats while maintaining sound quality and optimizing file sizes."
            sections={[
              {
                title: "Supported Formats",
                content: [
                  "MP3 - Most popular compressed audio format",
                  "WAV - Uncompressed high-quality audio",
                  "FLAC - Lossless compression for audiophiles",
                  "AAC - Advanced audio codec, iTunes standard",
                  "OGG - Open-source alternative to MP3",
                  "M4A - Apple's audio format"
                ]
              },
              {
                title: "Common Use Cases",
                content: [
                  "Convert WAV to MP3 to reduce file size",
                  "Convert MP3 to FLAC for better quality",
                  "Convert audio for different devices/platforms",
                  "Extract audio from video files"
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