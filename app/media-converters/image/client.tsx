"use client"

import { MediaConverter } from "@/components/shared/media-converter"
import { AboutDescription } from "@/components/ui/about-description"
import toolContent from "./image.json"

const imageFormats = [
  { value: 'jpg', label: 'JPEG', extensions: ['jpg', 'jpeg'], accept: '.jpg,.jpeg,image/jpeg' },
  { value: 'png', label: 'PNG', extensions: ['png'], accept: '.png,image/png' },
  { value: 'webp', label: 'WebP', extensions: ['webp'], accept: '.webp,image/webp' },
  { value: 'gif', label: 'GIF', extensions: ['gif'], accept: '.gif,image/gif' },
  { value: 'bmp', label: 'BMP', extensions: ['bmp'], accept: '.bmp,image/bmp' },
  { value: 'tiff', label: 'TIFF', extensions: ['tiff', 'tif'], accept: '.tiff,.tif,image/tiff' }
]

export default function ImageConverterClient() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{toolContent.pageTitle}</h1>
            <p className="text-muted-foreground">
              {toolContent.pageDescription}
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


          <AboutDescription
            title={toolContent.aboutTitle}
            description={toolContent.aboutDescription}
            sections={toolContent.sections}
          />
        </div>

        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}