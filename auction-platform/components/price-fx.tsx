"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRightLeft, TrendingUp, TrendingDown } from "lucide-react"
import { AuctionAPI } from "@/lib/api"

interface PriceFXProps {
  amount: number
  fromCurrency: string
  className?: string
}

export function PriceFX({ amount, fromCurrency, className }: PriceFXProps) {
  const [toCurrency, setToCurrency] = useState("USD")
  const [convertedAmount, setConvertedAmount] = useState(0)
  const [exchangeRate, setExchangeRate] = useState(0)
  const [loading, setLoading] = useState(false)

  const currencies = [
    { code: "MXN", name: "Peso Mexicano", symbol: "$" },
    { code: "USD", name: "Dólar Americano", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "ARS", name: "Peso Argentino", symbol: "$" },
  ]

  useEffect(() => {
    if (fromCurrency !== toCurrency) {
      loadExchangeRate()
    } else {
      setConvertedAmount(amount)
      setExchangeRate(1)
    }
  }, [amount, fromCurrency, toCurrency])

  const loadExchangeRate = async () => {
    setLoading(true)
    try {
      const rate = await AuctionAPI.getExchangeRate(fromCurrency, toCurrency)
      setExchangeRate(rate)
      setConvertedAmount(amount * rate)
    } catch (error) {
      console.error("Error loading exchange rate:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatAmount = (value: number, currency: string) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: currency,
    }).format(value)
  }

  const getRateChange = () => {
    // Simulate rate change (in a real app, this would come from the API)
    const change = (Math.random() - 0.5) * 0.1
    return change
  }

  const rateChange = getRateChange()

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold">{formatAmount(amount, fromCurrency)}</span>
        <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
        <Select value={toCurrency} onValueChange={setToCurrency}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {currencies
              .filter((c) => c.code !== fromCurrency)
              .map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.code}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xl font-bold">{loading ? "..." : formatAmount(convertedAmount, toCurrency)}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
            </span>
            <Badge variant={rateChange >= 0 ? "default" : "destructive"} className="text-xs">
              {rateChange >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {Math.abs(rateChange * 100).toFixed(2)}%
            </Badge>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={loadExchangeRate} disabled={loading}>
          <ArrowRightLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
