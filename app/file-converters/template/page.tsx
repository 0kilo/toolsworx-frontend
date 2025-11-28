"use client"

import { FileConverter } from "@/components/shared/file-converter"
import { AboutDescription } from "@/components/ui/about-description"

const templateFormats = [
  { value: 'format1', label: 'Format 1', extensions: ['fmt1'], accept: '.fmt1' },
  { value: 'format2', label: 'Format 2', extensions: ['fmt2'], accept: '.fmt2' },
]

export default function TemplateFileConverterPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Template File Converter</h1>
            <p className="text-muted-foreground">
              Convert between different file formats
            </p>
          </div>

          <FileConverter
            title="Template Format Converter"
            description="Convert between template formats"
            fromFormats={templateFormats}
            toFormats={templateFormats}
            defaultFrom="format1"
            defaultTo="format2"
          />

          <AboutDescription
            title="About Template Conversion"
            description="Convert files between template formats while maintaining quality."
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