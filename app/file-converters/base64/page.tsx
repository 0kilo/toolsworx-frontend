"use client"

import { FileConverter } from "@/components/shared/file-converter"
import { AboutDescription } from "@/components/ui/about-description"

const encodingFormats = [
  { value: 'text', label: 'Plain Text', extensions: ['txt'], accept: '.txt,text/plain' },
  { value: 'base64', label: 'Base64', extensions: ['txt'], accept: '*' }
]

export default function Base64ConverterPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Base64 Encoder/Decoder</h1>
            <p className="text-muted-foreground">
              Encode files to Base64 or decode Base64 to files
            </p>
          </div>

          <FileConverter
            title="Base64 Encoder/Decoder"
            description="Encode files to Base64 or decode Base64 to files"
            fromFormats={encodingFormats}
            toFormats={encodingFormats}
            defaultFrom="text"
            defaultTo="base64"
          />


          <AboutDescription
            title="About Base64 Encoding"
            description="Base64 encoding converts binary data into ASCII text format for safe transmission over text-based protocols."
            sections={[
              {
                title: "What is Base64?",
                content: [
                  "Text-safe encoding for binary data",
                  "Used in email attachments and web APIs",
                  "Converts any file type to ASCII text",
                  "Reversible encoding/decoding process"
                ]
              },
              {
                title: "Common Use Cases",
                content: [
                  "Embed images in HTML/CSS",
                  "Send binary data in JSON APIs",
                  "Store files in databases as text",
                  "Email attachment encoding"
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