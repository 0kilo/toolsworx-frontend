"use client"

import { MediaConverter } from "@/components/shared/media-converter"
import { convertVideoFile } from "@/lib/services/media-conversion"

const videoFormats = [
  { value: 'mp4', label: 'MP4', extensions: ['mp4'], accept: '.mp4,video/mp4' },
  { value: 'avi', label: 'AVI', extensions: ['avi'], accept: '.avi,video/x-msvideo' },
  { value: 'mkv', label: 'MKV', extensions: ['mkv'], accept: '.mkv,video/x-matroska' },
  { value: 'mov', label: 'MOV', extensions: ['mov'], accept: '.mov,video/quicktime' },
  { value: 'webm', label: 'WebM', extensions: ['webm'], accept: '.webm,video/webm' },
  { value: 'wmv', label: 'WMV', extensions: ['wmv'], accept: '.wmv,video/x-ms-wmv' }
]

export function VideoConverter({
  title,
  description,
  defaultFrom = 'avi',
  defaultTo = 'mp4',
}: {
  title: string
  description: string
  defaultFrom?: string
  defaultTo?: string
}) {
  return (
    <MediaConverter
      title={title}
      description={description}
      fromFormats={videoFormats}
      toFormats={videoFormats}
      defaultFrom={defaultFrom}
      defaultTo={defaultTo}
      maxSize={500}
      convertFn={(file, sourceFormat, targetFormat, options) =>
        convertVideoFile(file, sourceFormat, targetFormat, options)
      }
    />
  )
}
