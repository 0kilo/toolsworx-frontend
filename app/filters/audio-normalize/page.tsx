import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import AudionormalizeClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['audio-normalize'],
  category: 'filters/audio-normalize'
})

export default function AudionormalizePage() {
  return <AudionormalizeClient />
}
