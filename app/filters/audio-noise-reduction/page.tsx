import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import AudionoisereductionClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['audio-noise-reduction'],
  category: 'filters/audio-noise-reduction'
})

export default function AudionoisereductionPage() {
  return <AudionoisereductionClient />
}
