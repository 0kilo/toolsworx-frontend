import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import AudiobassboostClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['audio-bass-boost'],
  category: 'filters/audio-bass-boost'
})

export default function AudiobassboostPage() {
  return <AudiobassboostClient />
}
