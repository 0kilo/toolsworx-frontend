"use client"

import { FileConverter } from "@/components/shared/file-converter"
import { AboutDescription } from "@/components/ui/about-description"
import toolContent from "./base64.json"

const encodingFormats = [
  { value: 'text', label: 'Plain Text', extensions: ['txt'], accept: '.txt,text/plain' },
  { value: 'base64', label: 'Base64', extensions: ['txt'], accept: '*' }
]

export default function Base64Client() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {(() => {
            const [overview, ...sections] = toolContent.sections || []
            const aboutTitle = overview?.title || toolContent.title
            const aboutDescription = Array.isArray(overview?.content) ? overview.content[0] || toolContent.description : toolContent.description

            return (
              <>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{toolContent.title}</h1>
            <p className="text-muted-foreground">
              {toolContent.description}
            </p>
          </div>

          <FileConverter
            title={toolContent.title}
            description={toolContent.description}
            fromFormats={encodingFormats}
            toFormats={encodingFormats}
            defaultFrom="text"
            defaultTo="base64"
          />

          <AboutDescription
            title={aboutTitle}
            description={aboutDescription}
            sections={(sections || []).map(s => ({
              title: s?.title || '',
              content: s?.content || [],
              type: s?.type as 'list' | 'subsections' | undefined
            }))}
          />
              </>
            )
          })()}
        </div>

        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}
