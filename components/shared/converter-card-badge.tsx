"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/services/api-client"

interface ConverterCardBadgeProps {
  converterId: string
  isPopular: boolean
}

const REGION_TO_CURRENCY: Record<string, string> = {
  GB: "GBP",
  CA: "CAD",
  AU: "AUD",
  NZ: "NZD",
  JP: "JPY",
  KR: "KRW",
  CN: "CNY",
  IN: "INR",
  SG: "SGD",
  HK: "HKD",
  MX: "MXN",
  BR: "BRL",
  AR: "ARS",
  CL: "CLP",
  CO: "COP",
  ZA: "ZAR",
  NG: "NGN",
  EG: "EGP",
  TR: "TRY",
  SA: "SAR",
  AE: "AED",
  CH: "CHF",
  SE: "SEK",
  NO: "NOK",
  DK: "DKK",
  PL: "PLN",
  CZ: "CZK",
  HU: "HUF",
  RO: "RON",
  BG: "BGN",
  HR: "EUR",
  RS: "RSD",
  UA: "UAH",
  RU: "RUB",
  TH: "THB",
  MY: "MYR",
  ID: "IDR",
  PH: "PHP",
  VN: "VND",
  PK: "PKR",
  BD: "BDT",
  LK: "LKR",
  IL: "ILS",
}

const RANDOM_CURRENCIES = ["EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "SEK", "NOK", "SGD", "NZD"]

function getRegionFromLocale(locale?: string | null): string | null {
  if (!locale) return null
  const match = locale.match(/-([A-Z]{2})$/i)
  return match?.[1]?.toUpperCase() ?? null
}

function resolveTargetCurrency(): string {
  if (typeof navigator === "undefined") return "EUR"

  const localeCandidates = [...(navigator.languages ?? []), navigator.language].filter(Boolean)
  for (const locale of localeCandidates) {
    const region = getRegionFromLocale(locale)
    if (!region) continue
    if (region === "US") {
      return RANDOM_CURRENCIES[Math.floor(Math.random() * RANDOM_CURRENCIES.length)]
    }
    return REGION_TO_CURRENCY[region] ?? "EUR"
  }
  return "EUR"
}

export function ConverterCardBadge({ converterId, isPopular }: ConverterCardBadgeProps) {
  const shouldShowMarketBadge = converterId === "crypto-converter" || converterId === "currency"
  const [marketBadgeText, setMarketBadgeText] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadBadgeValue = async () => {
      try {
        if (converterId === "crypto-converter") {
          const btc = await apiClient.getCryptoPrice("BTC")
          if (!active || typeof btc?.price !== "number") return
          const formatted = new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
          }).format(btc.price)
          setMarketBadgeText(`BTC ${formatted}`)
          return
        }

        if (converterId === "currency") {
          const targetCurrency = resolveTargetCurrency()
          const rate = await apiClient.getCurrencyRate(targetCurrency)
          if (!active || typeof rate?.price !== "number") return
          const formatted = new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: targetCurrency,
            maximumFractionDigits: targetCurrency === "JPY" ? 0 : 4,
          }).format(rate.price)
          setMarketBadgeText(`1 USD = ${formatted}`)
        }
      } catch {
        // Keep fallback text on transient network failures.
      }
    }

    if (shouldShowMarketBadge) {
      void loadBadgeValue()
    }

    return () => {
      active = false
    }
  }, [converterId, shouldShowMarketBadge])

  const badgeText = shouldShowMarketBadge
    ? marketBadgeText ?? "Live"
    : isPopular
    ? "Popular"
    : null

  if (!badgeText) return null

  return (
    <Badge variant="secondary" className="text-xs">
      {badgeText}
    </Badge>
  )
}
