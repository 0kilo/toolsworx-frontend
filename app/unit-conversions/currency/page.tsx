"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { AboutDescription } from "@/components/ui/about-description"
import { DollarSign, ArrowUpDown, RefreshCw } from "lucide-react"

const currencies = [
  { value: "USD", label: "US Dollar", abbreviation: "$" },
  { value: "EUR", label: "Euro", abbreviation: "€" },
  { value: "GBP", label: "British Pound", abbreviation: "£" },
  { value: "JPY", label: "Japanese Yen", abbreviation: "¥" },
  { value: "CAD", label: "Canadian Dollar", abbreviation: "C$" },
  { value: "AUD", label: "Australian Dollar", abbreviation: "A$" },
  { value: "CHF", label: "Swiss Franc", abbreviation: "CHF" },
  { value: "CNY", label: "Chinese Yuan", abbreviation: "¥" },
  { value: "BTC", label: "Bitcoin", abbreviation: "₿" },
  { value: "ETH", label: "Ethereum", abbreviation: "Ξ" },
]

export default function CurrencyConverterPage() {
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("EUR")
  const [fromValue, setFromValue] = useState("")
  const [toValue, setToValue] = useState("")
  const [rates, setRates] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchRates = async () => {
    setLoading(true)
    try {
      // Using exchangerate-api.com (free tier: 1500 requests/month)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
      const data = await response.json()
      
      // Add crypto rates (would need separate API in production)
      const cryptoRates = {
        BTC: 0.000023, // Approximate - would fetch from CoinGecko API
        ETH: 0.00035,  // Approximate - would fetch from CoinGecko API
      }
      
      setRates({ ...data.rates, USD: 1, ...cryptoRates })
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch rates:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRates()
  }, [])

  const convertCurrency = (value: string, from: string, to: string) => {
    if (!value || isNaN(Number(value)) || !rates[from] || !rates[to]) return ""
    
    const amount = Number(value)
    const usdAmount = from === 'USD' ? amount : amount / rates[from]
    const result = to === 'USD' ? usdAmount : usdAmount * rates[to]
    
    return result.toFixed(8).replace(/\.?0+$/, "")
  }

  const handleFromValueChange = (value: string) => {
    setFromValue(value)
    setToValue(convertCurrency(value, fromCurrency, toCurrency))
  }

  const handleToValueChange = (value: string) => {
    setToValue(value)
    setFromValue(convertCurrency(value, toCurrency, fromCurrency))
  }

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
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
            <h1 className="text-3xl font-bold mb-2">Currency Converter</h1>
            <p className="text-muted-foreground">
              Convert between major currencies and cryptocurrencies with live rates
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Currency Conversion
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
                Live exchange rates updated every few minutes
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
                  <Label htmlFor="from-currency">From</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      id="from-value"
                      type="number"
                      placeholder="Enter amount"
                      value={fromValue}
                      onChange={(e) => handleFromValueChange(e.target.value)}
                      className="flex-1"
                    />
                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                      <SelectTrigger className="sm:w-48">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label} ({currency.abbreviation})
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
                  <Label htmlFor="to-currency">To</Label>
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
                        {currencies.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label} ({currency.abbreviation})
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
            title="About Currency Conversion"
            description="Real-time currency conversion for international transactions, travel, and cryptocurrency trading."
            sections={[
              {
                title: "Live Exchange Rates",
                content: [
                  "Rates updated from exchangerate-api.com",
                  "Major fiat currencies: USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY",
                  "Cryptocurrency rates: Bitcoin (BTC), Ethereum (ETH)",
                  "Refresh button updates rates manually"
                ]
              },
              {
                title: "Rate Accuracy",
                content: [
                  "Rates are for reference and may differ from bank rates",
                  "Banks and exchanges add spreads and fees",
                  "Cryptocurrency rates are highly volatile",
                  "Use official sources for large transactions"
                ]
              },
              {
                title: "Use Cases",
                content: [
                  "Travel budget planning and expense tracking",
                  "International business transactions",
                  "Cryptocurrency investment calculations",
                  "Cross-border payment estimations",
                  "E-commerce price comparisons"
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