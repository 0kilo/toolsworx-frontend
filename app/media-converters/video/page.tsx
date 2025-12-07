import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import VideoClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata.video,
  category: 'media-converters/video'
})

export default function VideoPage() {
  return <VideoClient />
}
