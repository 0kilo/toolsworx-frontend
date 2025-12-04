"use client"

import { MediaConverter } from "@/components/shared/media-converter"
import { AboutDescription } from "@/components/ui/about-description"
import toolContent from "./video.json"

const videoFormats = [
  { value: 'mp4', label: 'MP4', extensions: ['mp4'], accept: '.mp4,video/mp4' },
  { value: 'avi', label: 'AVI', extensions: ['avi'], accept: '.avi,video/x-msvideo' },
  { value: 'mkv', label: 'MKV', extensions: ['mkv'], accept: '.mkv,video/x-matroska' },
  { value: 'mov', label: 'MOV', extensions: ['mov'], accept: '.mov,video/quicktime' },
  { value: 'webm', label: 'WebM', extensions: ['webm'], accept: '.webm,video/webm' },
  { value: 'wmv', label: 'WMV', extensions: ['wmv'], accept: '.wmv,video/x-ms-wmv' }
]

export default function VideoConverterPage() {
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
            title="Video Format Converter"
            description="Convert between different video formats with quality and compression options"
            fromFormats={videoFormats}
            toFormats={videoFormats}
            defaultFrom="avi"
            defaultTo="mp4"
            maxSize={500}
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