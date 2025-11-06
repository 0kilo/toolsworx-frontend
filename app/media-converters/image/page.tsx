"use client"

import { MediaConverter } from "@/components/shared/media-converter"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"

const imageFormats = [
  { value: 'jpg', label: 'JPEG', extensions: ['jpg', 'jpeg'], accept: '.jpg,.jpeg,image/jpeg' },
  { value: 'png', label: 'PNG', extensions: ['png'], accept: '.png,image/png' },
  { value: 'webp', label: 'WebP', extensions: ['webp'], accept: '.webp,image/webp' },
  { value: 'gif', label: 'GIF', extensions: ['gif'], accept: '.gif,image/gif' },
  { value: 'bmp', label: 'BMP', extensions: ['bmp'], accept: '.bmp,image/bmp' },
  { value: 'tiff', label: 'TIFF', extensions: ['tiff', 'tif'], accept: '.tiff,.tif,image/tiff' }
]

export default function ImageConverterPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Image Converter</h1>
            <p className="text-muted-foreground">
              Convert between JPG, PNG, WebP, GIF, and other image formats
            </p>
          </div>

          <MediaConverter
            title="Image Format Converter"
            description="Convert between different image formats with quality preservation"
            fromFormats={imageFormats}
            toFormats={imageFormats}
            defaultFrom="jpg"
            defaultTo="png"
            maxSize={50}
          />

          <FooterAd />

          <AboutDescription
            title="About Image Conversion"
            description="Convert images between popular formats while maintaining quality and optimizing file sizes."
            sections={[
              {
                title: "Supported Formats",
                content: [
                  "JPEG/JPG - Best for photos with many colors",
                  "PNG - Best for images with transparency",
                  "WebP - Modern format with excellent compression",
                  "GIF - Best for simple animations",
                  "BMP - Uncompressed bitmap format",
                  "TIFF - High-quality format for professional use"
                ]
              },
              {
                title: "Common Use Cases",
                content: [
                  "Convert PNG to JPG to reduce file size",
                  "Convert JPG to PNG to add transparency",
                  "Convert images to WebP for web optimization",
                  "Convert between formats for compatibility"
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