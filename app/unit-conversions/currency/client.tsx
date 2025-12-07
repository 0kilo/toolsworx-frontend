"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { AboutDescription } from "@/components/ui/about-description"
import { DollarSign, ArrowUpDown, RefreshCw } from "lucide-react"
import { amplifyApiClient } from "@/lib/services/amplify-client"
import { convertCurrency } from "@/lib/tools/logic/unit-conversions/currency"
import toolContent from "./currency.json"

const currencies = toolContent.currencies.sort((a, b) => {
  if (a.value === 'USD') return -1
  if (b.value === 'USD') return 1
  return a.label.localeCompare(b.label)
})

export default function CurrencyConverterClient() {
  const [fromCurrency, setFromCurrency] = useState(toolContent.defaultFromCurrency)
  const [toCurrency, setToCurrency] = useState(toolContent.defaultToCurrency)
  const [fromValue, setFromValue] = useState("")
  const [toValue, setToValue] = useState("")
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1 })
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const handleConvert = (value: string, from: string, to: string) => {
    if (!value || isNaN(Number(value))) return ""

    try {
      const result = convertCurrency({
        value: Number(value),
        fromCurrency: from,
        toCurrency: to,
        rates
      })
      return result.result.toFixed(2)
    } catch (error) {
      return ""
    }
  }

  const fetchRate = async (currency: string) => {
    if (currency === 'USD' || rates[currency]) return

    setLoading(true)
    try {
      const data = await amplifyApiClient.getCurrencyRate(currency)
      if (data && data.price) {
        setRates(prev => ({ ...prev, [currency]: data.price }))
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error(`Failed to fetch ${currency}:`, error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRates = () => {
    fetchRate(fromCurrency)
    fetchRate(toCurrency)
  }

  // Fetch rates when currencies change
  useEffect(() => {
    fetchRate(fromCurrency)
    fetchRate(toCurrency)
  }, [fromCurrency, toCurrency])

  // Re-convert when rates change
  useEffect(() => {
    if (fromValue) {
      const result = handleConvert(fromValue, fromCurrency, toCurrency)
      setToValue(result)
    } else {
      setToValue("")
    }
  }, [rates, fromCurrency, toCurrency, fromValue])

  const handleFromValueChange = (value: string) => {
    setFromValue(value)
    // Conversion will happen automatically via useEffect
  }

  const handleToValueChange = (value: string) => {
    setToValue(value)
    // Convert backwards
    if (value) {
      const result = handleConvert(value, toCurrency, fromCurrency)
      if (result) {
        setFromValue(result)
      }
    } else {
      setFromValue("")
    }
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
              Convert between major currencies with exchange rates updated every 30 minutes
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
                Exchange rates updated every 30 minutes. For informational purposes only - do not use for actual transactions.
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
                            {currency.value} - {currency.label}
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
                            {currency.value} - {currency.label}
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
            title={`About ${toolContent.title}`}
            description={toolContent.description}
            sections={toolContent.sections}
          />
        </div>

        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}
