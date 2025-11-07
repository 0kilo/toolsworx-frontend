"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { LoadingSpinner } from "./loading-spinner"

export function PageLoadingIndicator() {
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setLoading(false)
  }, [pathname])

  useEffect(() => {
    const handleStart = () => {
      setLoading(true)
      setTimeout(() => setLoading(false), 2000) // Auto-hide after 2s
    }

    // Listen for link clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      if (link && link.href && link.href !== window.location.href) {
        handleStart()
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  if (!loading) return null

  return (
    <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg border">
      <LoadingSpinner size="sm" />
    </div>
  )
}