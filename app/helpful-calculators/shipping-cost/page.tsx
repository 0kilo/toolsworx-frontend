import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import ShippingcostClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['shipping-cost'],
  category: 'helpful-calculators/shipping-cost'
})

export default function ShippingcostPage() {
  return <ShippingcostClient />
}
