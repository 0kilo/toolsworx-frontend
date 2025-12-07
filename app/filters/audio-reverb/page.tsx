import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import AudioreverbClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['audio-reverb'],
  category: 'filters/audio-reverb'
})

export default function AudioreverbPage() {
  return <AudioreverbClient />
}
