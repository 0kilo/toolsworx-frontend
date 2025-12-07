import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import UsamapClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['usa-map'],
  category: 'charts/usa-map'
})

export default function UsamapPage() {
  return <UsamapClient />
}
