"use client"

import { MediaConverter } from "@/components/shared/media-converter"
import { convertImageFile } from "@/lib/services/api-client"

const imageFormats = [
  { value: 'jpg', label: 'JPEG', extensions: ['jpg', 'jpeg'], accept: '.jpg,.jpeg,image/jpeg' },
  { value: 'png', label: 'PNG', extensions: ['png'], accept: '.png,image/png' },
  { value: 'webp', label: 'WebP', extensions: ['webp'], accept: '.webp,image/webp' },
  { value: 'gif', label: 'GIF', extensions: ['gif'], accept: '.gif,image/gif' },
  { value: 'bmp', label: 'BMP', extensions: ['bmp'], accept: '.bmp,image/bmp' },
  { value: 'tiff', label: 'TIFF', extensions: ['tiff', 'tif'], accept: '.tiff,.tif,image/tiff' }
]

export function ImageConverter({
  title,
  description,
  defaultFrom = 'jpg',
  defaultTo = 'png',
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
      fromFormats={imageFormats}
      toFormats={imageFormats}
      defaultFrom={defaultFrom}
      defaultTo={defaultTo}
      maxSize={50}
      convertFn={(file, sourceFormat, targetFormat, options) =>
        convertImageFile(file, sourceFormat, targetFormat, options)
      }
    />
  )
}
