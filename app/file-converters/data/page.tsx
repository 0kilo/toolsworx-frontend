"use client"

import { FileConverter } from "@/components/shared/file-converter"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"

const dataFormats = [
  { value: 'json', label: 'JSON', extensions: ['json'], accept: '.json,application/json' },
  { value: 'xml', label: 'XML', extensions: ['xml'], accept: '.xml,application/xml,text/xml' },
  { value: 'yaml', label: 'YAML', extensions: ['yaml', 'yml'], accept: '.yaml,.yml,application/x-yaml' },
  { value: 'csv', label: 'CSV', extensions: ['csv'], accept: '.csv,text/csv' }
]

export default function DataConverterPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Data Format Converter</h1>
            <p className="text-muted-foreground">
              Convert between JSON, XML, YAML, and CSV data formats
            </p>
          </div>

          <FileConverter
            title="Data Format Converter"
            description="Convert between JSON, XML, YAML, and CSV data formats"
            fromFormats={dataFormats}
            toFormats={dataFormats}
            defaultFrom="json"
            defaultTo="xml"
          />

          <FooterAd />

          <AboutDescription
            title="About Data Format Conversion"
            description="Convert structured data between popular formats for APIs, configuration files, and data exchange."
            sections={[
              {
                title: "Supported Formats",
                content: [
                  "JSON - JavaScript Object Notation",
                  "XML - Extensible Markup Language",
                  "YAML - YAML Ain't Markup Language",
                  "CSV - Comma Separated Values"
                ]
              },
              {
                title: "Common Use Cases",
                content: [
                  "API data transformation",
                  "Configuration file conversion",
                  "Data migration between systems",
                  "Convert CSV data to structured formats"
                ]
              }
            ]}
          />
        </div>

        <div className="lg:col-span-1">
          <SidebarAd />
        </div>
      </div>
    </div>
  )
}