'use client'

import { Amplify } from 'aws-amplify'
import { useEffect } from 'react'

let amplifyConfigured = false

export function AmplifyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (amplifyConfigured) return
    
    try {
      // Try to load amplify outputs if available
      import('../../amplify_outputs.json')
        .then((outputs) => {
          Amplify.configure(outputs.default || outputs)
          amplifyConfigured = true
        })
        .catch(() => {
          // Fallback configuration for development
          console.log('Amplify outputs not found, using fallback config')
          amplifyConfigured = true
        })
    } catch (e) {
      console.log('Amplify configuration skipped')
      amplifyConfigured = true
    }
  }, [])

  return <>{children}</>
}