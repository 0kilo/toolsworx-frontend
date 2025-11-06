"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"
import { FileText, FileSpreadsheet, FileJson, Code, Archive } from "lucide-react"
import Link from "next/link"

const converterCategories = [
  {
    title: "Document Converter",
    description: "Convert between PDF, Word, Text, and other document formats",
    icon: FileText,
    href: "/file-converters/documents",
    formats: ["PDF", "Word", "Text", "HTML", "RTF"]
  },
  {
    title: "Spreadsheet Converter", 
    description: "Convert between Excel, CSV, and spreadsheet formats",
    icon: FileSpreadsheet,
    href: "/file-converters/spreadsheet",
    formats: ["Excel", "CSV", "OpenDocument"]
  },
  {
    title: "Data Format Converter",
    description: "Convert between JSON, XML, YAML, and CSV data formats", 
    icon: FileJson,
    href: "/file-converters/data",
    formats: ["JSON", "XML", "YAML", "CSV"]
  },
  {
    title: "Base64 Encoder/Decoder",
    description: "Encode files to Base64 or decode Base64 to files",
    icon: Code,
    href: "/file-converters/base64",
    formats: ["Text", "Base64"]
  },
  {
    title: "Archive Tools",
    description: "Create ZIP archives or extract files from archives",
    icon: Archive,
    href: "/file-converters/archive", 
    formats: ["ZIP", "Extract"]
  }
]

export default function FileConvertersPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">File Converters</h1>
            <p className="text-muted-foreground">
              Convert between different file formats quickly and securely
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {converterCategories.map((category) => {
              const Icon = category.icon
              return (
                <Card key={category.title} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {category.title}
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {category.formats.map((format) => (
                        <span key={format} className="px-2 py-1 bg-muted rounded-md text-sm">
                          {format}
                        </span>
                      ))}
                    </div>
                    <Button asChild className="w-full">
                      <Link href={category.href}>Open Converter</Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <FooterAd />

          <AboutDescription
            title="About File Conversion"
            description="Our file conversion tools support a wide range of formats and provide fast, secure conversion with automatic file cleanup."
            sections={[
              {
                title: "Supported Conversions",
                content: [
                  "Document formats: PDF ↔ Word ↔ Text ↔ RTF",
                  "Spreadsheets: Excel ↔ CSV ↔ OpenDocument",
                  "Data formats: JSON ↔ XML ↔ YAML",
                  "Encoding: Base64 encode/decode",
                  "Archives: ZIP creation and extraction"
                ]
              },
              {
                title: "Security & Privacy",
                content: [
                  "Files are processed securely on our servers",
                  "All uploaded files are automatically deleted after 1 hour",
                  "No registration or account required",
                  "HTTPS encryption for all file transfers"
                ]
              },
              {
                title: "File Size Limits",
                content: [
                  "Maximum file size: 50MB per file",
                  "Batch processing available for multiple files",
                  "Optimized for fast processing and download",
                  "Progress tracking for large file conversions"
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