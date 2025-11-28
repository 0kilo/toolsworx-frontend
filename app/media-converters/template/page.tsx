"use client"

import { MediaConverter } from "@/components/shared/media-converter"
import { AboutDescription } from "@/components/ui/about-description"

const templateFormats = [
  { value: 'format1', label: 'Format 1', extensions: ['fmt1'], accept: '.fmt1' },
  { value: 'format2', label: 'Format 2', extensions: ['fmt2'], accept: '.fmt2' },
]

export default function TemplateMediaConverterPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Template Media Converter</h1>
            <p className="text-muted-foreground">
              Convert between different media formats
            </p>
          </div>

          <MediaConverter
            title="Template Media Converter"
            description="Convert between different media formats with quality preservation"
            fromFormats={templateFormats}
            toFormats={templateFormats}
            defaultFrom="format1"
            defaultTo="format2"
            maxSize={100}
          />

          <AboutDescription
            title="About Template Media Conversion"
            description="Convert media between template formats while maintaining quality."
            sections={[
              {
                title: "Supported Formats",
                content: [
                  "Format 1 - Description",
                  "Format 2 - Description"
                ]
              },
              {
                title: "Common Use Cases",
                content: [
                  "Use case 1",
                  "Use case 2"
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