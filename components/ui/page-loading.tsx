"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { LoadingSpinner } from "./loading-spinner"

export function PageLoadingIndicator() {
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setLoading(false)
  }, [pathname])

  useEffect(() => {
    const handleStart = () => setLoading(true)
    const handleComplete = () => setLoading(false)

    // Listen for navigation events
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = function(...args) {
      handleStart()
      originalPushState.apply(history, args)
    }

    history.replaceState = function(...args) {
      handleStart()
      originalReplaceState.apply(history, args)
    }

    window.addEventListener('popstate', handleStart)

    return () => {
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
      window.removeEventListener('popstate', handleStart)
    }
  }, [])

  if (!loading) return null

  return (
    <div className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm rounded-full p-3 shadow-lg border">
      <LoadingSpinner size="sm" />
    </div>
  )
}