"use client"

import { MediaConverter } from "@/components/shared/media-converter"
import { AboutDescription } from "@/components/ui/about-description"

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
            <h1 className="text-3xl font-bold mb-2">Video Converter</h1>
            <p className="text-muted-foreground">
              Convert between MP4, AVI, MKV, MOV, and other video formats
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
            title="About Video Conversion"
            description="Convert video files between popular formats while maintaining quality and optimizing for different platforms."
            sections={[
              {
                title: "Supported Formats",
                content: [
                  "MP4 - Most compatible format for web and mobile",
                  "AVI - Classic Windows video format",
                  "MKV - Open-source container with advanced features",
                  "MOV - Apple QuickTime format",
                  "WebM - Google's web-optimized format",
                  "WMV - Windows Media Video format"
                ]
              },
              {
                title: "Common Use Cases",
                content: [
                  "Convert AVI to MP4 for better compatibility",
                  "Convert MOV to MP4 for web publishing",
                  "Convert videos for different devices",
                  "Reduce file size while maintaining quality"
                ]
              }
            ]}
          />
        </div>

        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}