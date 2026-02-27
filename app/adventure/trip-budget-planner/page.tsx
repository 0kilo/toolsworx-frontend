import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'
import { toolMetadata } from '@/lib/tool-metadata'
import TripBudgetPlannerClient from './client'

export const metadata: Metadata = generateToolMetadata({
  ...toolMetadata['trip-budget-planner'],
  category: 'adventure/trip-budget-planner'
})

export default function TripBudgetPlannerPage() {
  return <TripBudgetPlannerClient />
}
