import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import CryptoconverterClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['crypto-converter'],
  category: 'helpful-calculators/crypto-converter'
})

export default function CryptoconverterPage() {
  return <CryptoconverterClient />
}
