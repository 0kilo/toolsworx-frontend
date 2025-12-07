import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import AudioClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata.audio,
  category: 'media-converters/audio'
})

export default function AudioPage() {
  return <AudioClient />
}
