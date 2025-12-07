import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import AudioechoClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['audio-echo'],
  category: 'filters/audio-echo'
})

export default function AudioechoPage() {
  return <AudioechoClient />
}
