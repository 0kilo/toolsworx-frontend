"use client"

import { FileConverter } from "@/components/shared/file-converter"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"

const spreadsheetFormats = [
  { value: 'xlsx', label: 'Excel (XLSX)', extensions: ['xlsx'], accept: '.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  { value: 'xls', label: 'Excel (XLS)', extensions: ['xls'], accept: '.xls,application/vnd.ms-excel' },
  { value: 'csv', label: 'CSV', extensions: ['csv'], accept: '.csv,text/csv' },
  { value: 'ods', label: 'OpenDocument Spreadsheet', extensions: ['ods'], accept: '.ods' }
]

export default function SpreadsheetConverterPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Spreadsheet Converter</h1>
            <p className="text-muted-foreground">
              Convert between Excel, CSV, and other spreadsheet formats
            </p>
          </div>

          <FileConverter
            title="Spreadsheet Format Converter"
            description="Convert between Excel, CSV, and spreadsheet formats"
            fromFormats={spreadsheetFormats}
            toFormats={spreadsheetFormats}
            defaultFrom="csv"
            defaultTo="xlsx"
          />

          <FooterAd />

          <AboutDescription
            title="About Spreadsheet Conversion"
            description="Convert spreadsheets between popular formats while preserving data and formulas."
            sections={[
              {
                title: "Supported Formats",
                content: [
                  "Excel (XLSX/XLS) - Microsoft Excel spreadsheets",
                  "CSV - Comma Separated Values",
                  "ODS - OpenDocument Spreadsheet"
                ]
              },
              {
                title: "Common Use Cases",
                content: [
                  "CSV to Excel for data analysis",
                  "Excel to CSV for data import/export",
                  "Convert between Excel versions",
                  "Open proprietary formats in open source tools"
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