"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Wallet, AlertTriangle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { AuctionAPI } from "@/lib/api"
import type { Auction } from "@/lib/store"

interface CheckoutItem {
  auctionId: string
  auction: Auction
  winningBid: number
  buyersPremium: number
  taxes: number
  shippingCost: number
  total: number
}

export default function CheckoutPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState("wallet")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    loadCheckoutData()
  }, [user, router, searchParams])

  const loadCheckoutData = async () => {
    try {
      setLoading(true)
      const auctionId = searchParams.get("auction")

      if (auctionId) {
        const auction = await AuctionAPI.getAuction(auctionId)
        if (auction) {
          const winningBid = auction.currentBid
          const buyersPremium = winningBid * 0.15 // 15% buyer's premium
          const taxes = (winningBid + buyersPremium) * 0.16 // 16% IVA
          const shippingCost = 500 // Fixed shipping cost

          const item: CheckoutItem = {
            auctionId: auction.id,
            auction,
            winningBid,
            buyersPremium,
            taxes,
            shippingCost,
            total: winningBid + buyersPremium + taxes + shippingCost,
          }

          setCheckoutItems([item])
        }
      }
    } catch (err) {
      setError("Error al cargar los datos del checkout")
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!acceptTerms) {
      setError("Debes aceptar los términos y condiciones")
      return
    }

    setIsProcessing(true)
    setError("")

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Redirect to success page
      router.push("/pagos/exito")
    } catch (err) {
      setError("Error al procesar el pago. Intenta de nuevo.")
    } finally {
      setIsProcessing(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price)
  }

  const totalAmount = checkoutItems.reduce((sum, item) => sum + item.total, 0)

  if (!user) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p>Cargando checkout...</p>
        </div>
      </div>
    )
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">No hay elementos para pagar</h1>
          <Button onClick={() => router.push("/catalogo")}>Volver al Catálogo</Button>
        </div>
      </div>
    )
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
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-muted-foreground">Completa tu compra</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <Card>
              <CardHeader>
                <CardTitle>Artículos Ganados</CardTitle>
                <CardDescription>Subastas que has ganado y necesitas pagar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {checkoutItems.map((item) => (
                  <div key={item.auctionId} className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0">
                        <img
                          src={item.auction.imageUrl || "/placeholder.svg"}
                          alt={item.auction.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.auction.title}</h3>
                        <p className="text-muted-foreground line-clamp-2">{item.auction.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge>Ganada</Badge>
                          <span className="text-sm text-muted-foreground">Subasta #{item.auction.id}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Puja ganadora</span>
                        <span className="font-medium">{formatPrice(item.winningBid)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Comisión del comprador (15%)</span>
                        <span className="font-medium">{formatPrice(item.buyersPremium)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IVA (16%)</span>
                        <span className="font-medium">{formatPrice(item.taxes)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Envío</span>
                        <span className="font-medium">{formatPrice(item.shippingCost)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-primary">{formatPrice(item.total)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Método de Pago</CardTitle>
                <CardDescription>Selecciona cómo quieres pagar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === "wallet" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setPaymentMethod("wallet")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Wallet className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Wallet SubastaMax</p>
                        <p className="text-sm text-muted-foreground">Saldo disponible: $25,000 MXN</p>
                      </div>
                    </div>
                    <div className="w-4 h-4 border-2 border-primary rounded-full flex items-center justify-center">
                      {paymentMethod === "wallet" && <div className="w-2 h-2 bg-primary rounded-full" />}
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded" />
                      <div>
                        <p className="font-medium">Tarjeta de Crédito/Débito</p>
                        <p className="text-sm text-muted-foreground">Visa, Mastercard, American Express</p>
                      </div>
                    </div>
                    <div className="w-4 h-4 border-2 border-primary rounded-full flex items-center justify-center">
                      {paymentMethod === "card" && <div className="w-2 h-2 bg-primary rounded-full" />}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                    Acepto los{" "}
                    <a href="/terminos" className="text-primary hover:underline">
                      términos y condiciones
                    </a>{" "}
                    y la{" "}
                    <a href="/privacidad" className="text-primary hover:underline">
                      política de privacidad
                    </a>
                    . Entiendo que al completar esta compra, me comprometo a pagar el monto total y que la transacción
                    es final.
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(checkoutItems.reduce((sum, item) => sum + item.winningBid, 0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Comisiones</span>
                    <span>{formatPrice(checkoutItems.reduce((sum, item) => sum + item.buyersPremium, 0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA</span>
                    <span>{formatPrice(checkoutItems.reduce((sum, item) => sum + item.taxes, 0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>{formatPrice(checkoutItems.reduce((sum, item) => sum + item.shippingCost, 0))}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(totalAmount)}</span>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <Button onClick={handlePayment} disabled={!acceptTerms || isProcessing} className="w-full" size="lg">
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Procesando...
                    </>
                  ) : (
                    `Pagar ${formatPrice(totalAmount)}`
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Tu pago está protegido por nuestro sistema de garantía de comprador
                </p>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="flex justify-center">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="h-4 w-4 bg-green-600 rounded-full" />
                    </div>
                  </div>
                  <p className="text-sm font-medium">Pago 100% Seguro</p>
                  <p className="text-xs text-muted-foreground">
                    Tus datos están protegidos con encriptación SSL de 256 bits
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
