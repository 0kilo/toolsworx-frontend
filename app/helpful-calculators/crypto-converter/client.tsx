"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { AboutDescription } from "@/components/ui/about-description"
import { Bitcoin, ArrowUpDown, RefreshCw } from "lucide-react"
import { apiClient } from "@/lib/services/api-client"
import { convertCrypto } from "@/lib/tools/logic/helpful-calculators/helper-crypto"
import toolContent from "./crypto-converter.json"

const cryptos = [
  { value: "BTC", label: "Bitcoin", symbol: "₿" },
  { value: "ETH", label: "Ethereum", symbol: "Ξ" },
  { value: "BNB", label: "Binance Coin", symbol: "BNB" },
  { value: "XRP", label: "Ripple", symbol: "XRP" },
  { value: "ADA", label: "Cardano", symbol: "ADA" },
  { value: "DOGE", label: "Dogecoin", symbol: "DOGE" },
  { value: "SOL", label: "Solana", symbol: "SOL" },
  { value: "DOT", label: "Polkadot", symbol: "DOT" },
  { value: "MATIC", label: "Polygon", symbol: "MATIC" },
  { value: "LTC", label: "Litecoin", symbol: "LTC" },
]

const fiats = [
  { value: "USD", label: "US Dollar", symbol: "$" },
  { value: "EUR", label: "Euro", symbol: "€" },
  { value: "GBP", label: "British Pound", symbol: "£" },
  { value: "JPY", label: "Japanese Yen", symbol: "¥" },
  { value: "CAD", label: "Canadian Dollar", symbol: "C$" },
  { value: "AUD", label: "Australian Dollar", symbol: "A$" },
]

export default function CryptoconverterClient() {
  const [fromCrypto, setFromCrypto] = useState("BTC")
  const [toCurrency, setToCurrency] = useState("USD")
  const [fromValue, setFromValue] = useState("")
  const [toValue, setToValue] = useState("")
  const [cryptoRates, setCryptoRates] = useState<Record<string, { price: number }>>({})
  const [fiatRates, setFiatRates] = useState<Record<string, number>>({ USD: 1 })
  const [lastEdited, setLastEdited] = useState<"from" | "to">("from")
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [rateError, setRateError] = useState("")

  const parseNumber = (value: string) => Number((value || "").replace(/,/g, ""))
  const formatMoney = (value: number) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)

  const handleConvert = (value: string, from: string, to: string) => {
    const cryptoPrice = cryptoRates[from]?.price
    const fiatRate = fiatRates[to]
    const numericValue = parseNumber(value)
    if (!value || isNaN(numericValue) || !cryptoPrice || !fiatRate) {
      return ""
    }

    const result = convertCrypto({
      amount: numericValue,
      fromCrypto: from,
      toCurrency: to,
      cryptoPrice
    })

    return formatMoney(result.result * fiatRate)
  }

  const handleReverseConvert = (value: string, from: string, to: string) => {
    const cryptoPrice = cryptoRates[from]?.price
    const fiatRate = fiatRates[to]
    const numericValue = parseNumber(value)
    if (!value || isNaN(numericValue) || !cryptoPrice || !fiatRate) {
      return ""
    }

    const result = numericValue / (cryptoPrice * fiatRate)
    return result.toFixed(8).replace(/\.?0+$/, "")
  }

  const fetchRates = async (symbol: string, currency: string) => {
    setLoading(true)
    setRateError("")
    try {
      const [cryptoData, currencyData] = await Promise.all([
        apiClient.getCryptoPrice(symbol),
        apiClient.getCurrencyRate(currency),
      ])

      if (cryptoData && cryptoData.price) {
        setCryptoRates(prev => ({
          ...prev,
          [symbol]: {
            price: cryptoData.price,
          }
        }))
      }

      if (currencyData && typeof currencyData.price === "number") {
        setFiatRates(prev => ({
          ...prev,
          [currency]: currencyData.price,
        }))
      }

      setLastUpdated(new Date())
    } catch (error) {
      setRateError("Unable to load latest rates. Please try Refresh.")
      console.error(`Failed to fetch rates for ${symbol}/${currency}:`, error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch rates for current pair
  useEffect(() => {
    fetchRates(fromCrypto, toCurrency)
  }, [fromCrypto, toCurrency])

  const hasCurrentRates = Boolean(cryptoRates[fromCrypto]?.price && fiatRates[toCurrency])

  // Recalculate forward when user edits the "from" value
  useEffect(() => {
    if (lastEdited !== "from") return

    if (fromValue) {
      const result = handleConvert(fromValue, fromCrypto, toCurrency)
      setToValue(prev => (prev === result ? prev : result))
    } else {
      setToValue(prev => (prev === "" ? prev : ""))
    }
  }, [cryptoRates, fiatRates, fromCrypto, toCurrency, fromValue, lastEdited])

  // Recalculate reverse when user edits the "to" value
  useEffect(() => {
    if (lastEdited !== "to") return

    if (toValue) {
      const result = handleReverseConvert(toValue, fromCrypto, toCurrency)
      setFromValue(prev => (prev === result ? prev : result))
    } else {
      setFromValue(prev => (prev === "" ? prev : ""))
    }
  }, [cryptoRates, fiatRates, fromCrypto, toCurrency, toValue, lastEdited])

  const handleFromValueChange = (value: string) => {
    setLastEdited("from")
    setFromValue(value)
    if (!hasCurrentRates) {
      fetchRates(fromCrypto, toCurrency)
    }
  }

  const handleToValueChange = (value: string) => {
    setLastEdited("to")
    setToValue(value)
    if (!hasCurrentRates) {
      fetchRates(fromCrypto, toCurrency)
    }
  }

  const swapCurrencies = () => {
    setLastEdited(lastEdited === "from" ? "to" : "from")
    setFromValue(toValue)
    setToValue(fromValue)
  }

  const clearValues = () => {
    setFromValue("")
    setToValue("")
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{toolContent.pageTitle}</h1>
            <p className="text-muted-foreground">
              {toolContent.pageDescription}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bitcoin className="h-5 w-5" />
                Cryptocurrency Conversion
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchRates(fromCrypto, toCurrency)}
                  disabled={loading}
                  className="ml-auto"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </CardTitle>
              <CardDescription>
                Cryptocurrency prices updated every 30 minutes. For informational purposes only - do not use for actual transactions.
                {lastUpdated && (
                  <span className="block mt-3 text-sm text-muted-foreground">
                    Last updated: <span className="text-blue-600">{lastUpdated.toLocaleTimeString()}</span>
                  </span>
                )}
                {rateError && (
                  <span className="block text-xs text-red-600 mt-1">
                    {rateError}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="from-crypto">From (Cryptocurrency)</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      id="from-value"
                      type="text"
                      inputMode="decimal"
                      placeholder="Enter amount"
                      value={fromValue}
                      onChange={(e) => handleFromValueChange(e.target.value)}
                      className="flex-1"
                    />
                    <Select value={fromCrypto} onValueChange={setFromCrypto}>
                      <SelectTrigger className="sm:w-48">
                        <SelectValue placeholder="Select crypto" />
                      </SelectTrigger>
                      <SelectContent>
                        {cryptos.map((crypto) => (
                          <SelectItem key={crypto.value} value={crypto.value}>
                            {crypto.label} ({crypto.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-center md:mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={swapCurrencies}
                  className="rounded-full"
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to-currency">To (Fiat Currency)</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      id="to-value"
                      type="text"
                      inputMode="decimal"
                      placeholder="Result"
                      value={toValue}
                      onChange={(e) => handleToValueChange(e.target.value)}
                      className="flex-1"
                    />
                    <Select value={toCurrency} onValueChange={setToCurrency}>
                      <SelectTrigger className="sm:w-48">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {fiats.map((fiat) => (
                          <SelectItem key={fiat.value} value={fiat.value}>
                            {fiat.label} ({fiat.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={clearValues} className="flex-1">
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <AboutDescription
            title={toolContent.aboutTitle}
            description={toolContent.aboutDescription}
            sections={toolContent.sections}
          />
        </div>

        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}
