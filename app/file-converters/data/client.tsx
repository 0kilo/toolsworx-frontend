"use client"

import { FileConverter } from "@/components/shared/file-converter"
import { AboutDescription } from "@/components/ui/about-description"
import toolContent from "./data.json"

const dataFormats = [
  { value: 'json', label: 'JSON', extensions: ['json'], accept: '.json,application/json' },
  { value: 'xml', label: 'XML', extensions: ['xml'], accept: '.xml,application/xml,text/xml' },
  { value: 'yaml', label: 'YAML', extensions: ['yaml', 'yml'], accept: '.yaml,.yml,application/x-yaml' },
  { value: 'csv', label: 'CSV', extensions: ['csv'], accept: '.csv,text/csv' }
]

export default function DataClient() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{toolContent.title}</h1>
            <p className="text-muted-foreground">
              {toolContent.description}
            </p>
          </div>

          <FileConverter
            title={toolContent.title}
            description={toolContent.description}
            fromFormats={dataFormats}
            toFormats={dataFormats}
            defaultFrom="json"
            defaultTo="xml"
          />

          <AboutDescription
            title={toolContent.sections[0].title}
            description={toolContent.sections[0].content[0]}
            sections={toolContent.sections.slice(1).map(s => ({
              title: s.title,
              content: s.content,
              type: s.type as 'list' | 'subsections' | undefined
            }))}
          />
        </div>

        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}