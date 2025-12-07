import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import ImageeffectsClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['image-effects'],
  category: 'filters/image-effects'
})

export default function ImageeffectsPage() {
  return <ImageeffectsClient />
}
