"use client"

import { FileConverter } from "@/components/shared/file-converter"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"

const documentFormats = [
  { value: 'pdf', label: 'PDF', extensions: ['pdf'], accept: '.pdf,application/pdf' },
  { value: 'docx', label: 'Word (DOCX)', extensions: ['docx'], accept: '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { value: 'doc', label: 'Word (DOC)', extensions: ['doc'], accept: '.doc,application/msword' },
  { value: 'txt', label: 'Text', extensions: ['txt'], accept: '.txt,text/plain' },
  { value: 'rtf', label: 'Rich Text', extensions: ['rtf'], accept: '.rtf,application/rtf' },
  { value: 'odt', label: 'OpenDocument Text', extensions: ['odt'], accept: '.odt' },
  { value: 'html', label: 'HTML', extensions: ['html'], accept: '.html,text/html' }
]

export default function DocumentConverterPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Document Converter</h1>
            <p className="text-muted-foreground">
              Convert between PDF, Word, Text, and other document formats
            </p>
          </div>

          <FileConverter
            title="Document Format Converter"
            description="Convert between PDF, Word, and text formats"
            fromFormats={documentFormats}
            toFormats={documentFormats}
            defaultFrom="pdf"
            defaultTo="docx"
          />

          <FooterAd />

          <AboutDescription
            title="About Document Conversion"
            description="Convert documents between popular formats while maintaining formatting and quality."
            sections={[
              {
                title: "Supported Formats",
                content: [
                  "PDF - Portable Document Format",
                  "Word (DOCX/DOC) - Microsoft Word documents",
                  "Text (TXT) - Plain text files",
                  "RTF - Rich Text Format",
                  "ODT - OpenDocument Text",
                  "HTML - Web page format"
                ]
              },
              {
                title: "Common Use Cases",
                content: [
                  "PDF to Word for editing documents",
                  "Word to PDF for sharing and printing",
                  "Extract text from PDF files",
                  "Convert HTML to PDF for archiving"
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