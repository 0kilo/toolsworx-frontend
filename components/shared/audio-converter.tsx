"use client"

import { MediaConverter } from "@/components/shared/media-converter"
import { convertAudioFile } from "@/lib/services/api-client"

const audioFormats = [
  { value: 'mp3', label: 'MP3', extensions: ['mp3'], accept: '.mp3,audio/mpeg' },
  { value: 'wav', label: 'WAV', extensions: ['wav'], accept: '.wav,audio/wav' },
  { value: 'flac', label: 'FLAC', extensions: ['flac'], accept: '.flac,audio/flac' },
  { value: 'aac', label: 'AAC', extensions: ['aac'], accept: '.aac,audio/aac' },
  { value: 'ogg', label: 'OGG', extensions: ['ogg'], accept: '.ogg,audio/ogg' },
  { value: 'm4a', label: 'M4A', extensions: ['m4a'], accept: '.m4a,audio/mp4' }
]

export function AudioConverter({ title, description }: { title: string; description: string }) {
  return (
    <MediaConverter
      title={title}
      description={description}
      fromFormats={audioFormats}
      toFormats={audioFormats}
      defaultFrom="wav"
      defaultTo="mp3"
      maxSize={200}
      convertFn={(file, sourceFormat, targetFormat, options) =>
        convertAudioFile(file, sourceFormat, targetFormat, options)
      }
      downloadPath={(jobId) => `/api/audio/download/${jobId}`}
    />
  )
}
