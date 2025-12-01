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

const currencies = [
  { value: "USD", label: "US Dollar" },
  { value: "AED", label: "UAE Dirham" },
  { value: "AFN", label: "Afghan Afghani" },
  { value: "ALL", label: "Albanian Lek" },
  { value: "AMD", label: "Armenian Dram" },
  { value: "ANG", label: "Netherlands Antillean Guilder" },
  { value: "AOA", label: "Angolan Kwanza" },
  { value: "ARS", label: "Argentine Peso" },
  { value: "AUD", label: "Australian Dollar" },
  { value: "AWG", label: "Aruban Florin" },
  { value: "AZN", label: "Azerbaijani Manat" },
  { value: "BAM", label: "Bosnia-Herzegovina Convertible Mark" },
  { value: "BBD", label: "Barbadian Dollar" },
  { value: "BDT", label: "Bangladeshi Taka" },
  { value: "BGN", label: "Bulgarian Lev" },
  { value: "BHD", label: "Bahraini Dinar" },
  { value: "BIF", label: "Burundian Franc" },
  { value: "BMD", label: "Bermudan Dollar" },
  { value: "BND", label: "Brunei Dollar" },
  { value: "BOB", label: "Bolivian Boliviano" },
  { value: "BRL", label: "Brazilian Real" },
  { value: "BSD", label: "Bahamian Dollar" },
  { value: "BTN", label: "Bhutanese Ngultrum" },
  { value: "BWP", label: "Botswanan Pula" },
  { value: "BYN", label: "Belarusian Ruble" },
  { value: "BZD", label: "Belize Dollar" },
  { value: "CAD", label: "Canadian Dollar" },
  { value: "CDF", label: "Congolese Franc" },
  { value: "CHF", label: "Swiss Franc" },
  { value: "CLF", label: "Chilean Unit of Account (UF)" },
  { value: "CLP", label: "Chilean Peso" },
  { value: "CNH", label: "Chinese Yuan (Offshore)" },
  { value: "CNY", label: "Chinese Yuan" },
  { value: "COP", label: "Colombian Peso" },
  { value: "CRC", label: "Costa Rican Colón" },
  { value: "CUP", label: "Cuban Peso" },
  { value: "CVE", label: "Cape Verdean Escudo" },
  { value: "CZK", label: "Czech Koruna" },
  { value: "DJF", label: "Djiboutian Franc" },
  { value: "DKK", label: "Danish Krone" },
  { value: "DOP", label: "Dominican Peso" },
  { value: "DZD", label: "Algerian Dinar" },
  { value: "EGP", label: "Egyptian Pound" },
  { value: "ERN", label: "Eritrean Nakfa" },
  { value: "ETB", label: "Ethiopian Birr" },
  { value: "EUR", label: "Euro" },
  { value: "FJD", label: "Fijian Dollar" },
  { value: "FKP", label: "Falkland Islands Pound" },
  { value: "FOK", label: "Faroese Króna" },
  { value: "GBP", label: "British Pound" },
  { value: "GEL", label: "Georgian Lari" },
  { value: "GGP", label: "Guernsey Pound" },
  { value: "GHS", label: "Ghanaian Cedi" },
  { value: "GIP", label: "Gibraltar Pound" },
  { value: "GMD", label: "Gambian Dalasi" },
  { value: "GNF", label: "Guinean Franc" },
  { value: "GTQ", label: "Guatemalan Quetzal" },
  { value: "GYD", label: "Guyanaese Dollar" },
  { value: "HKD", label: "Hong Kong Dollar" },
  { value: "HNL", label: "Honduran Lempira" },
  { value: "HRK", label: "Croatian Kuna" },
  { value: "HTG", label: "Haitian Gourde" },
  { value: "HUF", label: "Hungarian Forint" },
  { value: "IDR", label: "Indonesian Rupiah" },
  { value: "ILS", label: "Israeli New Shekel" },
  { value: "IMP", label: "Manx Pound" },
  { value: "INR", label: "Indian Rupee" },
  { value: "IQD", label: "Iraqi Dinar" },
  { value: "IRR", label: "Iranian Rial" },
  { value: "ISK", label: "Icelandic Króna" },
  { value: "JEP", label: "Jersey Pound" },
  { value: "JMD", label: "Jamaican Dollar" },
  { value: "JOD", label: "Jordanian Dinar" },
  { value: "JPY", label: "Japanese Yen" },
  { value: "KES", label: "Kenyan Shilling" },
  { value: "KGS", label: "Kyrgystani Som" },
  { value: "KHR", label: "Cambodian Riel" },
  { value: "KID", label: "Kiribati Dollar" },
  { value: "KMF", label: "Comorian Franc" },
  { value: "KRW", label: "South Korean Won" },
  { value: "KWD", label: "Kuwaiti Dinar" },
  { value: "KYD", label: "Cayman Islands Dollar" },
  { value: "KZT", label: "Kazakhstani Tenge" },
  { value: "LAK", label: "Laotian Kip" },
  { value: "LBP", label: "Lebanese Pound" },
  { value: "LKR", label: "Sri Lankan Rupee" },
  { value: "LRD", label: "Liberian Dollar" },
  { value: "LSL", label: "Lesotho Loti" },
  { value: "LYD", label: "Libyan Dinar" },
  { value: "MAD", label: "Moroccan Dirham" },
  { value: "MDL", label: "Moldovan Leu" },
  { value: "MGA", label: "Malagasy Ariary" },
  { value: "MKD", label: "Macedonian Denar" },
  { value: "MMK", label: "Myanmar Kyat" },
  { value: "MNT", label: "Mongolian Tugrik" },
  { value: "MOP", label: "Macanese Pataca" },
  { value: "MRU", label: "Mauritanian Ouguiya" },
  { value: "MUR", label: "Mauritian Rupee" },
  { value: "MVR", label: "Maldivian Rufiyaa" },
  { value: "MWK", label: "Malawian Kwacha" },
  { value: "MXN", label: "Mexican Peso" },
  { value: "MYR", label: "Malaysian Ringgit" },
  { value: "MZN", label: "Mozambican Metical" },
  { value: "NAD", label: "Namibian Dollar" },
  { value: "NGN", label: "Nigerian Naira" },
  { value: "NIO", label: "Nicaraguan Córdoba" },
  { value: "NOK", label: "Norwegian Krone" },
  { value: "NPR", label: "Nepalese Rupee" },
  { value: "NZD", label: "New Zealand Dollar" },
  { value: "OMR", label: "Omani Rial" },
  { value: "PAB", label: "Panamanian Balboa" },
  { value: "PEN", label: "Peruvian Nuevo Sol" },
  { value: "PGK", label: "Papua New Guinean Kina" },
  { value: "PHP", label: "Philippine Peso" },
  { value: "PKR", label: "Pakistani Rupee" },
  { value: "PLN", label: "Polish Zloty" },
  { value: "PYG", label: "Paraguayan Guarani" },
  { value: "QAR", label: "Qatari Rial" },
  { value: "RON", label: "Romanian Leu" },
  { value: "RSD", label: "Serbian Dinar" },
  { value: "RUB", label: "Russian Ruble" },
  { value: "RWF", label: "Rwandan Franc" },
  { value: "SAR", label: "Saudi Riyal" },
  { value: "SBD", label: "Solomon Islands Dollar" },
  { value: "SCR", label: "Seychellois Rupee" },
  { value: "SDG", label: "Sudanese Pound" },
  { value: "SEK", label: "Swedish Krona" },
  { value: "SGD", label: "Singapore Dollar" },
  { value: "SHP", label: "Saint Helena Pound" },
  { value: "SLE", label: "Sierra Leonean Leone" },
  { value: "SLL", label: "Sierra Leonean Leone (Old)" },
  { value: "SOS", label: "Somali Shilling" },
  { value: "SRD", label: "Surinamese Dollar" },
  { value: "SSP", label: "South Sudanese Pound" },
  { value: "STN", label: "São Tomé and Príncipe Dobra" },
  { value: "SYP", label: "Syrian Pound" },
  { value: "SZL", label: "Swazi Lilangeni" },
  { value: "THB", label: "Thai Baht" },
  { value: "TJS", label: "Tajikistani Somoni" },
  { value: "TMT", label: "Turkmenistani Manat" },
  { value: "TND", label: "Tunisian Dinar" },
  { value: "TOP", label: "Tongan Paʻanga" },
  { value: "TRY", label: "Turkish Lira" },
  { value: "TTD", label: "Trinidad and Tobago Dollar" },
  { value: "TVD", label: "Tuvaluan Dollar" },
  { value: "TWD", label: "New Taiwan Dollar" },
  { value: "TZS", label: "Tanzanian Shilling" },
  { value: "UAH", label: "Ukrainian Hryvnia" },
  { value: "UGX", label: "Ugandan Shilling" },
  { value: "UYU", label: "Uruguayan Peso" },
  { value: "UZS", label: "Uzbekistan Som" },
  { value: "VES", label: "Venezuelan Bolívar" },
  { value: "VND", label: "Vietnamese Dong" },
  { value: "VUV", label: "Vanuatu Vatu" },
  { value: "WST", label: "Samoan Tala" },
  { value: "XAF", label: "Central African CFA Franc" },
  { value: "XCD", label: "East Caribbean Dollar" },
  { value: "XCG", label: "Caribbean Guilder" },
  { value: "XDR", label: "Special Drawing Rights" },
  { value: "XOF", label: "West African CFA Franc" },
  { value: "XPF", label: "CFP Franc" },
  { value: "YER", label: "Yemeni Rial" },
  { value: "ZAR", label: "South African Rand" },
  { value: "ZMW", label: "Zambian Kwacha" },
  { value: "ZWG", label: "Zimbabwean Gold" },
  { value: "ZWL", label: "Zimbabwean Dollar" },
].sort((a, b) => {
  if (a.value === 'USD') return -1
  if (b.value === 'USD') return 1
  return a.label.localeCompare(b.label)
})

export default function CurrencyConverterPage() {
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("EUR")
  const [fromValue, setFromValue] = useState("")
  const [toValue, setToValue] = useState("")
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1 })
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const convertCurrency = (value: string, from: string, to: string) => {
    if (!value || isNaN(Number(value))) return ""

    const amount = Number(value)

    // Both from and to are in USD base, so convert through USD
    if (from === 'USD') {
      if (!rates[to]) return ""
      const result = amount * rates[to]
      return result.toFixed(2)
    } else if (to === 'USD') {
      if (!rates[from]) return ""
      const result = amount / rates[from]
      return result.toFixed(2)
    } else {
      if (!rates[from] || !rates[to]) return ""
      // Convert from -> USD -> to
      const usdAmount = amount / rates[from]
      const result = usdAmount * rates[to]
      return result.toFixed(2)
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
      const result = convertCurrency(fromValue, fromCurrency, toCurrency)
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
      const result = convertCurrency(value, toCurrency, fromCurrency)
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
            title="About Currency Conversion"
            description="Currency conversion for informational purposes using exchange rates updated every 30 minutes. Not suitable for actual transactions."
            sections={[
              {
                title: "Exchange Rates",
                content: [
                  "Rates updated every 30 minutes from market data sources",
                  "Stored in DynamoDB for fast access",
                  "Major fiat currencies supported",
                  "Data may be delayed up to 30 minutes"
                ]
              },
              {
                title: "Important Disclaimers",
                content: [
                  "Rates are for informational purposes only",
                  "Do not use for actual financial transactions",
                  "Banks and exchanges have different rates with spreads and fees",
                  "Data may be delayed - always verify with official sources",
                  "Not suitable for trading or time-sensitive decisions"
                ]
              },
              {
                title: "Use Cases",
                content: [
                  "Travel budget planning and estimates",
                  "General price comparisons across countries",
                  "Educational and reference purposes",
                  "Rough estimates for financial planning",
                  "Learning about exchange rates and currency markets"
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