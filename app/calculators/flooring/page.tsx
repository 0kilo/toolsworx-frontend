import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import FlooringClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['flooring'],
  category: 'calculators/flooring'
})

export default function FlooringPage() {
  return <FlooringClient />
}
