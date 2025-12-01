"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { AboutDescription } from "@/components/ui/about-description"
import { Bitcoin, ArrowUpDown, RefreshCw, TrendingUp, TrendingDown } from "lucide-react"
import { amplifyApiClient } from "@/lib/services/amplify-client"

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

export default function CryptoConverterPage() {
  const [fromCrypto, setFromCrypto] = useState("BTC")
  const [toCurrency, setToCurrency] = useState("USD")
  const [fromValue, setFromValue] = useState("")
  const [toValue, setToValue] = useState("")
  const [rates, setRates] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const convertCrypto = (value: string, from: string, to: string) => {
    if (!value || isNaN(Number(value)) || !rates[from] || !rates[from].price) {
      return ""
    }

    const amount = Number(value)
    const cryptoInUSD = amount * rates[from].price

    // If converting to USD, return directly
    if (to === 'USD') {
      return cryptoInUSD.toFixed(2)
    }

    // For other currencies, would need currency conversion rate
    // For now, just return USD value
    return cryptoInUSD.toFixed(2)
  }

  const fetchRate = async (symbol: string) => {
    setLoading(true)
    try {
      const data = await amplifyApiClient.getCryptoPrice(symbol)
      if (data && data.price) {
        setRates(prev => ({
          ...prev,
          [symbol]: {
            price: data.price,
            usd: data.price,
            change24h: 0,
            volume24h: 0,
            marketCap: 0
          }
        }))
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error(`Failed to fetch ${symbol}:`, error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRates = () => fetchRate(fromCrypto)

  // Fetch rate for current crypto
  useEffect(() => {
    fetchRate(fromCrypto)
  }, [fromCrypto])

  // Re-convert when rates change
  useEffect(() => {
    if (fromValue) {
      const result = convertCrypto(fromValue, fromCrypto, toCurrency)
      setToValue(result)
    } else {
      setToValue("")
    }
  }, [rates, fromCrypto, toCurrency, fromValue])

  const handleFromValueChange = (value: string) => {
    setFromValue(value)
    // Conversion will happen automatically via useEffect
  }

  const handleToValueChange = (value: string) => {
    setToValue(value)
    // Convert backwards - from fiat to crypto
    if (value && !isNaN(Number(value)) && rates[fromCrypto] && rates[fromCrypto].price) {
      const rate = rates[fromCrypto].price
      const result = Number(value) / rate
      setFromValue(result.toFixed(8).replace(/\.?0+$/, ""))
    } else if (!value) {
      setFromValue("")
    }
  }

  const swapCurrencies = () => {
    // Only swap if we have a crypto to fiat conversion
    if (cryptos.find(c => c.value === toCurrency)) {
      setFromCrypto(toCurrency)
      setToCurrency(fromCrypto)
      setFromValue(toValue)
      setToValue(fromValue)
    }
  }

  const clearValues = () => {
    setFromValue("")
    setToValue("")
  }

  const getCurrentPrice = () => {
    if (rates[fromCrypto] && rates[fromCrypto].price) {
      return rates[fromCrypto].price
    }
    return null
  }

  const getPriceChange = () => {
    if (rates[fromCrypto] && rates[fromCrypto].change24h) {
      return rates[fromCrypto].change24h
    }
    return null
  }

  const currentPrice = getCurrentPrice()
  const priceChange = getPriceChange()

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Crypto Currency Converter</h1>
            <p className="text-muted-foreground">
              Convert cryptocurrencies to fiat currencies with market rates updated every 30 minutes
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
                  onClick={fetchRates}
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
                  <span className="block text-xs text-muted-foreground mt-1">
                    Last updated: {lastUpdated.toLocaleTimeString()}
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
                      type="number"
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
                    disabled={!cryptos.find(c => c.value === toCurrency)}
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to-currency">To (Fiat Currency)</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      id="to-value"
                      type="number"
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
            title="About Cryptocurrency Conversion"
            description="Cryptocurrency to fiat currency conversion using market data updated every 30 minutes. For informational purposes only."
            sections={[
              {
                title: "Supported Cryptocurrencies",
                content: [
                  "Bitcoin (BTC) - The original cryptocurrency",
                  "Ethereum (ETH) - Smart contract platform",
                  "Binance Coin (BNB) - Exchange token",
                  "Ripple (XRP) - Cross-border payments",
                  "Cardano (ADA) - Proof-of-stake blockchain",
                  "Dogecoin (DOGE) - Meme cryptocurrency",
                  "Solana (SOL) - High-performance blockchain",
                  "And more popular cryptocurrencies"
                ]
              },
              {
                title: "Market Data",
                content: [
                  "Prices updated every 30 minutes from market data sources",
                  "Stored in DynamoDB for fast access",
                  "Data may be delayed - not suitable for trading decisions",
                  "For informational and educational purposes only",
                  "Accurate to 8 decimal places"
                ]
              },
              {
                title: "Use Cases",
                content: [
                  "General portfolio value estimates",
                  "Educational and learning purposes",
                  "Rough tax calculation estimates (verify with official sources)",
                  "Understanding cryptocurrency values",
                  "Informational reference only - not for trading"
                ]
              }
            ]}
          />
        </div>

        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}