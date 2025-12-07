import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import RecipescalerClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['recipe-scaler'],
  category: 'helpful-calculators/recipe-scaler'
})

export default function RecipescalerPage() {
  return <RecipescalerClient />
}
