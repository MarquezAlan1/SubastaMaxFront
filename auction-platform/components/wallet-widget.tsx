"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wallet, Plus, Minus, TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

interface WalletBalance {
  currency: string
  amount: number
  symbol: string
}

export function WalletWidget() {
  const { user } = useAuth()
  const [balances, setBalances] = useState<WalletBalance[]>([
    { currency: "MXN", amount: 2500, symbol: "$" },
    { currency: "USD", amount: 150, symbol: "$" },
    { currency: "EUR", amount: 120, symbol: "€" },
  ])
  const [selectedCurrency, setSelectedCurrency] = useState("MXN")
  const [loading, setLoading] = useState(false)

  const currentBalance = balances.find((b) => b.currency === selectedCurrency) || balances[0]

  const refreshBalances = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  if (!user) return null

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wallet className="h-5 w-5" />
            Mi Wallet
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={refreshBalances} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Currency Selector */}
        <div className="flex items-center gap-2">
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {balances.map((balance) => (
                <SelectItem key={balance.currency} value={balance.currency}>
                  {balance.currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex-1">
            <p className="text-2xl font-bold">{formatAmount(currentBalance.amount, currentBalance.currency)}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Link href="/wallet/depositar" className="flex-1">
            <Button size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-1" />
              Depositar
            </Button>
          </Link>
          <Link href="/wallet/retirar" className="flex-1">
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              <Minus className="h-4 w-4 mr-1" />
              Retirar
            </Button>
          </Link>
        </div>

        {/* Recent Activity Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-3 w-3 text-red-500" />
              <span>Puja - Arte Contemporáneo</span>
            </div>
            <span className="text-red-500">-$500</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>Depósito</span>
            </div>
            <span className="text-green-500">+$1,000</span>
          </div>
        </div>

        <Link href="/wallet">
          <Button variant="ghost" size="sm" className="w-full">
            Ver Detalles Completos
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
