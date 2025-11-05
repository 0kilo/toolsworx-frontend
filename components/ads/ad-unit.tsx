"use client"

import { useEffect } from "react"
import { siteConfig } from "@/config/site"

interface AdUnitProps {
  slot: string
  format?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal"
  responsive?: boolean
  className?: string
}

export function AdUnit({
  slot,
  format = "auto",
  responsive = true,
  className = ""
}: AdUnitProps) {
  useEffect(() => {
    if (siteConfig.adsense.enabled) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (err) {
        console.error("AdSense error:", err)
      }
    }
  }, [])

  if (!siteConfig.adsense.enabled) {
    // Show placeholder when AdSense is not enabled
    return (
      <div className={`flex items-center justify-center bg-muted rounded-lg p-8 ${className}`}>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Advertisement Placeholder</p>
          <p className="text-xs text-muted-foreground mt-1">
            Slot: {slot}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={siteConfig.adsense.client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  )
}

// Pre-configured ad units for common placements
export function HeaderAd() {
  return (
    <AdUnit
      slot="1234567890"
      format="horizontal"
      className="mb-8"
    />
  )
}

export function SidebarAd() {
  return (
    <AdUnit
      slot="0987654321"
      format="vertical"
      className="sticky top-20"
    />
  )
}

export function InContentAd() {
  return (
    <AdUnit
      slot="1122334455"
      format="rectangle"
      className="my-8"
    />
  )
}

export function FooterAd() {
  return (
    <AdUnit
      slot="5544332211"
      format="horizontal"
      className="mt-8"
    />
  )
}
