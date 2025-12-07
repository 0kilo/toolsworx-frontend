import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import AudioequalizerClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['audio-equalizer'],
  category: 'filters/audio-equalizer'
})

export default function AudioequalizerPage() {
  return <AudioequalizerClient />
}
