import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import TipClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['tip'],
  category: 'calculators/tip'
})

export default function TipPage() {
  return <TipClient />
}
