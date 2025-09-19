"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Gavel, TrendingUp, Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { AuctionAPI } from "@/lib/api"
import type { Auction, Bid } from "@/lib/store"

interface BidPanelProps {
  auction: Auction
  onBidPlaced?: (bid: Bid) => void
}

export function BidPanel({ auction, onBidPlaced }: BidPanelProps) {
  const { user } = useAuth()
  const [bidAmount, setBidAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastBidStatus, setLastBidStatus] = useState<"success" | "error" | null>(null)
  const [error, setError] = useState("")
  const [suggestedBids, setSuggestedBids] = useState<number[]>([])

  useEffect(() => {
    // Calculate suggested bid amounts
    const current = auction.currentBid || auction.startingBid
    const increment = auction.increment
    const suggestions = [
      current + increment,
      current + increment * 2,
      current + increment * 5,
      current + increment * 10,
    ]
    setSuggestedBids(suggestions)
  }, [auction.currentBid, auction.startingBid, auction.increment])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price)
  }

  const handleBidSubmit = async (amount?: number) => {
    if (!user) {
      setError("Debes iniciar sesión para pujar")
      return
    }

    const bidValue = amount || Number.parseFloat(bidAmount)
    if (!bidValue || bidValue <= auction.currentBid) {
      setError("La puja debe ser mayor al precio actual")
      return
    }

    setIsSubmitting(true)
    setError("")
    setLastBidStatus(null)

    try {
      const result = await AuctionAPI.placeBid(auction.id, bidValue, user.id)

      if (result.success && result.bid) {
        setLastBidStatus("success")
        setBidAmount("")
        onBidPlaced?.(result.bid)

        // Show success for 3 seconds
        setTimeout(() => setLastBidStatus(null), 3000)
      } else {
        setLastBidStatus("error")
        setError(result.error || "Error al procesar la puja")
      }
    } catch (err) {
      setLastBidStatus("error")
      setError("Error de conexión. Intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isAuctionActive = auction.status === "live"
  const minBid = auction.currentBid + auction.increment
  const currentBidValue = Number.parseFloat(bidAmount) || 0

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gavel className="h-5 w-5 text-primary" />
          Panel de Pujas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Bid Info */}
        <div className="text-center space-y-2">
          <div>
            <p className="text-sm text-muted-foreground">Puja actual</p>
            <p className="text-3xl font-bold text-primary">{formatPrice(auction.currentBid)}</p>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>{auction.bidCount} pujas</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Incremento: {formatPrice(auction.increment)}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bid Status */}
        {lastBidStatus && (
          <Alert variant={lastBidStatus === "success" ? "default" : "destructive"}>
            <div className="flex items-center gap-2">
              {lastBidStatus === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {lastBidStatus === "success" ? "¡Puja enviada exitosamente!" : "Error al enviar la puja"}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {!isAuctionActive ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {auction.status === "upcoming" ? "La subasta aún no ha comenzado" : "La subasta ha finalizado"}
            </AlertDescription>
          </Alert>
        ) : !user ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Debes iniciar sesión para participar en la subasta</AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Quick Bid Buttons */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Pujas rápidas</p>
              <div className="grid grid-cols-2 gap-2">
                {suggestedBids.slice(0, 4).map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => handleBidSubmit(amount)}
                    disabled={isSubmitting}
                    className="text-xs"
                  >
                    {formatPrice(amount)}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Custom Bid */}
            <div className="space-y-3">
              <p className="text-sm font-medium">Puja personalizada</p>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder={`Mín. ${formatPrice(minBid)}`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={minBid}
                    step={auction.increment}
                    disabled={isSubmitting}
                  />
                  {currentBidValue > 0 && currentBidValue <= auction.currentBid && (
                    <p className="text-xs text-destructive mt-1">Debe ser mayor a {formatPrice(auction.currentBid)}</p>
                  )}
                </div>
                <Button
                  onClick={() => handleBidSubmit()}
                  disabled={isSubmitting || !bidAmount || currentBidValue <= auction.currentBid}
                  className="px-6"
                >
                  {isSubmitting ? "Pujando..." : "Pujar"}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Bid Rules */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Incremento mínimo: {formatPrice(auction.increment)}</p>
              <p>• Las pujas son vinculantes</p>
              {auction.autoExtend && <p>• Auto-extensión: +2 min si hay pujas en los últimos 30s</p>}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
