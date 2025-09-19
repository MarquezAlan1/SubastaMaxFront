"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, Banknote, Smartphone, Shield, Info } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { PriceFX } from "@/components/price-fx"

interface PaymentMethod {
  id: string
  type: "card" | "bank" | "digital"
  name: string
  icon: React.ReactNode
  fee: number
  processingTime: string
  minAmount: number
  maxAmount: number
}

export default function DepositPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("MXN")
  const [selectedMethod, setSelectedMethod] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  const paymentMethods: PaymentMethod[] = [
    {
      id: "card",
      type: "card",
      name: "Tarjeta de Crédito/Débito",
      icon: <CreditCard className="h-5 w-5" />,
      fee: 3.5,
      processingTime: "Inmediato",
      minAmount: 100,
      maxAmount: 50000,
    },
    {
      id: "bank",
      type: "bank",
      name: "Transferencia Bancaria",
      icon: <Banknote className="h-5 w-5" />,
      fee: 0,
      processingTime: "1-2 días hábiles",
      minAmount: 500,
      maxAmount: 100000,
    },
    {
      id: "digital",
      type: "digital",
      name: "Wallet Digital",
      icon: <Smartphone className="h-5 w-5" />,
      fee: 2.0,
      processingTime: "Inmediato",
      minAmount: 50,
      maxAmount: 25000,
    },
  ]

  const selectedPaymentMethod = paymentMethods.find((m) => m.id === selectedMethod)
  const numericAmount = Number.parseFloat(amount) || 0
  const fee = selectedPaymentMethod ? (numericAmount * selectedPaymentMethod.fee) / 100 : 0
  const totalAmount = numericAmount + fee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!selectedPaymentMethod) {
      setError("Selecciona un método de pago")
      return
    }

    if (numericAmount < selectedPaymentMethod.minAmount) {
      setError(`El monto mínimo es ${formatAmount(selectedPaymentMethod.minAmount, currency)}`)
      return
    }

    if (numericAmount > selectedPaymentMethod.maxAmount) {
      setError(`El monto máximo es ${formatAmount(selectedPaymentMethod.maxAmount, currency)}`)
      return
    }

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Redirect to success page or back to wallet
      router.push("/wallet?deposit=success")
    } catch (err) {
      setError("Error al procesar el depósito. Intenta de nuevo.")
    } finally {
      setIsProcessing(false)
    }
  }

  const formatAmount = (value: number, curr: string) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: curr,
    }).format(value)
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Depositar Fondos</h1>
            <p className="text-muted-foreground">Añade dinero a tu wallet de forma segura</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount and Currency */}
              <Card>
                <CardHeader>
                  <CardTitle>Monto a Depositar</CardTitle>
                  <CardDescription>Especifica la cantidad y moneda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Monto</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        min="1"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Moneda</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                          <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {numericAmount > 0 && (
                    <div className="p-4 bg-muted rounded-lg">
                      <PriceFX amount={numericAmount} fromCurrency={currency} />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Método de Pago</CardTitle>
                  <CardDescription>Selecciona cómo quieres depositar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedMethod === method.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedMethod(method.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {method.icon}
                          <div>
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-muted-foreground">{method.processingTime}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={method.fee === 0 ? "default" : "secondary"}>
                            {method.fee === 0 ? "Sin comisión" : `${method.fee}% comisión`}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatAmount(method.minAmount, currency)} - {formatAmount(method.maxAmount, currency)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Todos los depósitos están protegidos con encriptación de nivel bancario. Tus datos financieros están
                  seguros.
                </AlertDescription>
              </Alert>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isProcessing || !selectedMethod || numericAmount <= 0}>
                {isProcessing ? "Procesando..." : `Depositar ${formatAmount(totalAmount, currency)}`}
              </Button>
            </form>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Depósito</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Monto</span>
                  <span className="font-semibold">{formatAmount(numericAmount, currency)}</span>
                </div>
                {fee > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Comisión</span>
                    <span className="font-semibold">{formatAmount(fee, currency)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total a pagar</span>
                  <span className="text-xl font-bold text-primary">{formatAmount(totalAmount, currency)}</span>
                </div>

                {selectedPaymentMethod && (
                  <div className="space-y-2 pt-4">
                    <div className="flex items-center gap-2">
                      {selectedPaymentMethod.icon}
                      <span className="font-medium">{selectedPaymentMethod.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tiempo de procesamiento: {selectedPaymentMethod.processingTime}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Información Importante
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">Límites de depósito:</p>
                  <p className="text-muted-foreground">Diario: $50,000 MXN</p>
                  <p className="text-muted-foreground">Mensual: $500,000 MXN</p>
                </div>
                <div>
                  <p className="font-medium">Verificación:</p>
                  <p className="text-muted-foreground">
                    Depósitos superiores a $10,000 MXN requieren verificación adicional
                  </p>
                </div>
                <div>
                  <p className="font-medium">Soporte:</p>
                  <p className="text-muted-foreground">Disponible 24/7 para ayudarte con tus transacciones</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
