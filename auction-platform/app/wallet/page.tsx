"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PriceFX } from "@/components/price-fx"
import {
  Wallet,
  Plus,
  Minus,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "bid" | "refund" | "payment"
  amount: number
  currency: string
  description: string
  timestamp: Date
  status: "completed" | "pending" | "failed"
  reference?: string
}

interface WalletBalance {
  currency: string
  amount: number
  symbol: string
  frozen: number
}

export default function WalletPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedCurrency, setSelectedCurrency] = useState("MXN")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [balances, setBalances] = useState<WalletBalance[]>([
    { currency: "MXN", amount: 2500, symbol: "$", frozen: 500 },
    { currency: "USD", amount: 150, symbol: "$", frozen: 25 },
    { currency: "EUR", amount: 120, symbol: "€", frozen: 0 },
  ])
  const [loading, setLoading] = useState(false)
  const [filterType, setFilterType] = useState("all")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    loadTransactions()
  }, [user, router])

  const loadTransactions = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockTransactions: Transaction[] = [
      {
        id: "1",
        type: "deposit",
        amount: 1000,
        currency: "MXN",
        description: "Depósito con tarjeta de crédito",
        timestamp: new Date(Date.now() - 3600000),
        status: "completed",
        reference: "DEP-001",
      },
      {
        id: "2",
        type: "bid",
        amount: -500,
        currency: "MXN",
        description: "Puja - Arte Contemporáneo",
        timestamp: new Date(Date.now() - 7200000),
        status: "completed",
        reference: "BID-002",
      },
      {
        id: "3",
        type: "withdrawal",
        amount: -200,
        currency: "USD",
        description: "Retiro a cuenta bancaria",
        timestamp: new Date(Date.now() - 86400000),
        status: "pending",
        reference: "WTH-003",
      },
      {
        id: "4",
        type: "refund",
        amount: 300,
        currency: "MXN",
        description: "Reembolso - Subasta cancelada",
        timestamp: new Date(Date.now() - 172800000),
        status: "completed",
        reference: "REF-004",
      },
      {
        id: "5",
        type: "payment",
        amount: -1500,
        currency: "MXN",
        description: "Pago por subasta ganada",
        timestamp: new Date(Date.now() - 259200000),
        status: "completed",
        reference: "PAY-005",
      },
    ]

    setTransactions(mockTransactions)
    setLoading(false)
  }

  const currentBalance = balances.find((b) => b.currency === selectedCurrency) || balances[0]

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: currency,
    }).format(Math.abs(amount))
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case "bid":
        return <TrendingDown className="h-4 w-4 text-orange-500" />
      case "refund":
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      case "payment":
        return <CreditCard className="h-4 w-4 text-purple-500" />
      default:
        return <Wallet className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completado</Badge>
      case "pending":
        return <Badge variant="secondary">Pendiente</Badge>
      case "failed":
        return <Badge variant="destructive">Fallido</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === "all") return true
    return t.type === filterType
  })

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Wallet className="h-8 w-8 text-primary" />
              Mi Wallet
            </h1>
            <p className="text-muted-foreground">Gestiona tus fondos y transacciones</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={loadTransactions} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              {balances.map((balance) => (
                <Card
                  key={balance.currency}
                  className={selectedCurrency === balance.currency ? "ring-2 ring-primary" : ""}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{balance.currency}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCurrency(balance.currency)}
                        className={selectedCurrency === balance.currency ? "bg-primary/10" : ""}
                      >
                        Seleccionar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Disponible</p>
                        <p className="text-2xl font-bold">{formatAmount(balance.amount, balance.currency)}</p>
                      </div>
                      {balance.frozen > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground">Congelado</p>
                          <p className="text-sm font-medium text-orange-600">
                            {formatAmount(balance.frozen, balance.currency)}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Transactions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Historial de Transacciones</CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="deposit">Depósitos</SelectItem>
                        <SelectItem value="withdrawal">Retiros</SelectItem>
                        <SelectItem value="bid">Pujas</SelectItem>
                        <SelectItem value="payment">Pagos</SelectItem>
                        <SelectItem value="refund">Reembolsos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                        <div className="w-10 h-10 bg-muted rounded" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4" />
                          <div className="h-3 bg-muted rounded w-1/2" />
                        </div>
                        <div className="h-6 bg-muted rounded w-20" />
                      </div>
                    ))}
                  </div>
                ) : filteredTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <Wallet className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No hay transacciones</h3>
                    <p className="text-muted-foreground">Tus transacciones aparecerán aquí</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-shrink-0">{getTransactionIcon(transaction.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium truncate">{transaction.description}</p>
                            {getStatusBadge(transaction.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{transaction.timestamp.toLocaleDateString("es-MX")}</span>
                            {transaction.reference && <span>Ref: {transaction.reference}</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-lg font-semibold ${
                              transaction.amount > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {transaction.amount > 0 ? "+" : ""}
                            {formatAmount(transaction.amount, transaction.currency)}
                          </p>
                          <p className="text-xs text-muted-foreground">{transaction.currency}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/wallet/depositar">
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Depositar Fondos
                  </Button>
                </Link>
                <Link href="/wallet/retirar">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Minus className="mr-2 h-4 w-4" />
                    Retirar Fondos
                  </Button>
                </Link>
                <Link href="/wallet/transferir">
                  <Button variant="outline" className="w-full bg-transparent">
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Transferir
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Currency Converter */}
            <Card>
              <CardHeader>
                <CardTitle>Conversor de Moneda</CardTitle>
                <CardDescription>Tipos de cambio en tiempo real</CardDescription>
              </CardHeader>
              <CardContent>
                <PriceFX amount={currentBalance.amount} fromCurrency={selectedCurrency} />
              </CardContent>
            </Card>

            {/* Account Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Cuenta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total en MXN</span>
                  <span className="font-semibold">$3,250.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Fondos congelados</span>
                  <span className="font-semibold text-orange-600">$525.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pujas activas</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Transacciones este mes</span>
                  <span className="font-semibold">12</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
