"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"

export default function PdfWordPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">PDF to Word Converter</h1>
            <p className="text-muted-foreground">
              Convert PDF documents to Word format (DOCX)
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>
                PDF to Word conversion will be available soon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-8 text-center">
                <p className="text-muted-foreground">
                  This converter requires server-side processing with LibreOffice or similar tools.
                  Follow the implementation guide in the README to add this functionality.
                </p>
              </div>
            </CardContent>
          </Card>

          <FooterAd />

          <AboutDescription
            title="About PDF to Word Conversion"
            description="Converting PDF files to Word documents allows you to edit the content easily. This is useful for modifying contracts, reports, and other documents."
            sections={[
              {
                title: "Implementation Steps",
                content: [
                  "Set up AWS Lambda with LibreOffice layer",
                  "Create file upload API endpoint",
                  "Process PDF to DOCX conversion",
                  "Return downloadable file"
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
