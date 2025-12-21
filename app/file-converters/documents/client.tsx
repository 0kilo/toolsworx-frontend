"use client"

import { FileConverter } from "@/components/shared/file-converter"
import { AboutDescription } from "@/components/ui/about-description"
import toolContent from "./documents.json"

const documentFormats = [
  { value: 'pdf', label: 'PDF', extensions: ['pdf'], accept: '.pdf,application/pdf' },
  { value: 'docx', label: 'Word (DOCX)', extensions: ['docx'], accept: '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { value: 'doc', label: 'Word (DOC)', extensions: ['doc'], accept: '.doc,application/msword' },
  { value: 'txt', label: 'Text', extensions: ['txt'], accept: '.txt,text/plain' },
  { value: 'rtf', label: 'Rich Text', extensions: ['rtf'], accept: '.rtf,application/rtf' },
  { value: 'odt', label: 'OpenDocument Text', extensions: ['odt'], accept: '.odt' },
  { value: 'html', label: 'HTML', extensions: ['html'], accept: '.html,text/html' }
]

export default function DocumentsClient() {
  return (
    <div className="container py-8">
      {(() => {
        const [overview, ...sections] = toolContent.sections || []
        const aboutTitle = overview?.title || toolContent.title
        const aboutDescription = Array.isArray(overview?.content) ? overview?.content[0] || toolContent.description : toolContent.description

        return (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold mb-2">{toolContent.title}</h1>
              <p className="text-muted-foreground">
                {toolContent.description}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8">
              <div className="space-y-8">
                <FileConverter
                  title={toolContent.title}
                  description={toolContent.description}
                  fromFormats={documentFormats}
                  toFormats={documentFormats}
                  defaultFrom="pdf"
                  defaultTo="docx"
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
              </div>

              <aside className="space-y-6">
                <div className="rounded-lg border p-6">
                  <h3 className="text-lg font-semibold mb-3">Quick steps</h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2">
                    <li>Select the file format you have.</li>
                    <li>Choose the format you want.</li>
                    <li>Upload and download the result.</li>
                  </ol>
                </div>

                <div className="rounded-lg border p-6">
                  <h3 className="text-lg font-semibold mb-3">Supported formats</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    {documentFormats.map((format) => (
                      <li key={format.value}>
                        <span className="font-medium text-foreground">{format.label}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          .{format.extensions[0]}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </>
        )
      })()}
    </div>
  )
}
