"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"
import { Button } from "@/components/ui/button"
import { Upload, Download } from "lucide-react"

export default function ImageBlur_Page() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Blur Image</h1>
            <p className="text-muted-foreground">
              Apply blur effect to images
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
              <CardDescription>
                Select a file to convert
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted rounded-lg p-12 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Drag and drop your file here, or click to browse
                </p>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  This converter requires backend service integration.
                  Files are processed securely and deleted automatically.
                </p>
              </div>
            </CardContent>
          </Card>

          <FooterAd />

          <AboutDescription
            title="About Blur Image"
            description="Apply blur effect to images This conversion maintains quality and formatting while ensuring your privacy with automatic file deletion."
            sections={[
              {
                title: "How It Works",
                content: [
                  "Upload your source file",
                  "File is converted using industry-standard tools",
                  "Download your converted file instantly",
                  "Files are automatically deleted after 1 hour"
                ]
              },
              {
                title: "Features",
                content: [
                  "Fast and reliable conversion",
                  "Maintains formatting and quality",
                  "Secure processing with auto-deletion",
                  "No registration required"
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
