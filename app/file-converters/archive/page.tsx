"use client"

import { FileConverter } from "@/components/shared/file-converter"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"

const archiveFormats = [
  { value: 'files', label: 'Individual Files', extensions: ['*'], accept: '*' },
  { value: 'zip', label: 'ZIP Archive', extensions: ['zip'], accept: '.zip,application/zip' }
]

export default function ArchiveConverterPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Archive Tools</h1>
            <p className="text-muted-foreground">
              Create ZIP archives or extract files from archives
            </p>
          </div>

          <FileConverter
            title="Archive Tools"
            description="Create ZIP archives or extract files from archives"
            fromFormats={archiveFormats}
            toFormats={archiveFormats}
            defaultFrom="files"
            defaultTo="zip"
          />

          <FooterAd />

          <AboutDescription
            title="About Archive Tools"
            description="Compress multiple files into archives or extract files from existing archives."
            sections={[
              {
                title: "Supported Operations",
                content: [
                  "Create ZIP archives from multiple files",
                  "Extract files from ZIP archives",
                  "Compress files to save space",
                  "Batch file operations"
                ]
              },
              {
                title: "Common Use Cases",
                content: [
                  "Backup multiple files",
                  "Send multiple files as one attachment",
                  "Reduce file size for storage",
                  "Extract downloaded archives"
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