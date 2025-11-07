"use client"

import { useState } from "react"
import { ShareOptions } from "@/lib/services/share-service"

export function useShare() {
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [shareData, setShareData] = useState<ShareOptions | null>(null)

  const openShare = (options: ShareOptions) => {
    setShareData(options)
    setIsShareOpen(true)
  }

  const closeShare = () => {
    setIsShareOpen(false)
    setShareData(null)
  }

  return {
    isShareOpen,
    shareData,
    openShare,
    closeShare
  }
}