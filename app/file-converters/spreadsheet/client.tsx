"use client"

import { FileConverter } from "@/components/shared/file-converter"
import { AboutDescription } from "@/components/ui/about-description"
import toolContent from "./spreadsheet.json"

const spreadsheetFormats = [
  { value: 'xlsx', label: 'Excel (XLSX)', extensions: ['xlsx'], accept: '.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  { value: 'xls', label: 'Excel (XLS)', extensions: ['xls'], accept: '.xls,application/vnd.ms-excel' },
  { value: 'csv', label: 'CSV', extensions: ['csv'], accept: '.csv,text/csv' },
  { value: 'ods', label: 'OpenDocument Spreadsheet', extensions: ['ods'], accept: '.ods' }
]

export default function SpreadsheetClient() {
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
            fromFormats={spreadsheetFormats}
            toFormats={spreadsheetFormats}
            defaultFrom="csv"
            defaultTo="xlsx"
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
