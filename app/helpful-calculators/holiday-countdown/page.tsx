import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import HolidaycountdownClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['holiday-countdown'],
  category: 'helpful-calculators/holiday-countdown'
})

export default function HolidaycountdownPage() {
  return <HolidaycountdownClient />
}
