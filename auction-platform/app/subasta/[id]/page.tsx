"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoPlayer } from "@/components/video-player"
import { BidPanel } from "@/components/bid-panel"
import { Timer } from "@/components/timer"
import { ChatLive } from "@/components/chat-live"
import { BidHistory } from "@/components/bid-history"
import { LiveBadge } from "@/components/live-badge"
import { ArrowLeft, Users, Eye, Share2, Heart, Flag, Info } from "lucide-react"
import { AuctionAPI } from "@/lib/api"
import { useAuctionStore, type Auction, type Bid } from "@/lib/store"
import { useAuth } from "@/lib/auth-context"

export default function AuctionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [auction, setAuction] = useState<Auction | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [viewerCount, setViewerCount] = useState(0)
  const { setCurrentAuction, updateAuction } = useAuctionStore()

  useEffect(() => {
    loadAuction()
  }, [params.id])

  useEffect(() => {
    if (!auction) return

    // Simulate WebSocket connection for real-time updates
    const cleanup = AuctionAPI.simulateWebSocket(auction.id, (data) => {
      if (data.type === "bid_update") {
        setAuction((prev) =>
          prev
            ? {
                ...prev,
                currentBid: data.bid.amount,
                bidCount: prev.bidCount + 1,
              }
            : null,
        )
      } else if (data.type === "participants_update") {
        setViewerCount(data.count)
      }
    })

    // Set initial viewer count
    setViewerCount(Math.floor(Math.random() * 200) + 50)

    return cleanup
  }, [auction])

  const loadAuction = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await AuctionAPI.getAuction(params.id as string)
      if (data) {
        setAuction(data)
        setCurrentAuction(data)
      } else {
        setError("Subasta no encontrada")
      }
    } catch (err) {
      setError("Error al cargar la subasta")
    } finally {
      setLoading(false)
    }
  }

  const handleBidPlaced = (bid: Bid) => {
    if (auction) {
      const updatedAuction = {
        ...auction,
        currentBid: bid.amount,
        bidCount: auction.bidCount + 1,
      }
      setAuction(updatedAuction)
      updateAuction(auction.id, { currentBid: bid.amount, bidCount: auction.bidCount + 1 })
    }
  }

  const handleAuctionEnd = () => {
    if (auction) {
      const updatedAuction = { ...auction, status: "ended" as const }
      setAuction(updatedAuction)
      updateAuction(auction.id, { status: "ended" })
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="grid md:grid-cols-[2fr_1fr] gap-4">
              <div className="space-y-6">
                <div className="aspect-video bg-muted rounded" />
                <div className="h-32 bg-muted rounded" />
              </div>
              <div className="space-y-6">
                <div className="h-96 bg-muted rounded" />
                <div className="h-64 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !auction) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-muted-foreground mb-4">{error || "Subasta no encontrada"}</p>
          <Button onClick={() => router.back()}>Volver</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{auction.title}</h1>
              {auction.status === "live" && <LiveBadge />}
              {auction.featured && <Badge variant="secondary">DESTACADA</Badge>}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{viewerCount} participantes</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>Subastador: {auction.auctioneerName}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
          {/* Left Column - Video and Details */}
          <div className="space-y-6">
            <div className="col-span-1 md:col-span-1">
              <VideoPlayer videoUrl={auction.videoUrl} isLive={auction.status === "live"} viewerCount={viewerCount} />
            </div>

            {/* Auction Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Información de la Subasta</CardTitle>
                  {auction.status === "live" && (
                    <Timer endTime={auction.endTime} onTimeUp={handleAuctionEnd} size="lg" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Precio inicial</p>
                    <p className="text-lg font-semibold">{formatPrice(auction.startingBid)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Incremento mínimo</p>
                    <p className="text-lg font-semibold">{formatPrice(auction.increment)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Inicio</p>
                    <p className="text-sm">
                      {auction.startTime.toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fin programado</p>
                    <p className="text-sm">
                      {auction.endTime.toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Descripción</h3>
                  <p className="text-muted-foreground">{auction.description}</p>
                </div>

                {auction.autoExtend && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Esta subasta tiene auto-extensión activada. Se añadirán 2 minutos adicionales si hay pujas en los
                      últimos 30 segundos.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Tabs for additional info */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Detalles</TabsTrigger>
                <TabsTrigger value="terms">Términos</TabsTrigger>
                <TabsTrigger value="shipping">Envío</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold">Categoría</h4>
                        <p className="text-muted-foreground capitalize">{auction.category}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Condición</h4>
                        <p className="text-muted-foreground">Excelente estado</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Procedencia</h4>
                        <p className="text-muted-foreground">Colección privada verificada</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="terms">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-semibold">Términos de la Subasta</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>Todas las pujas son vinculantes</li>
                          <li>El pago debe realizarse dentro de 48 horas</li>
                          <li>Se requiere verificación de identidad para pujas superiores a $50,000</li>
                          <li>Comisión del comprador: 15%</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="shipping">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-semibold">Opciones de Envío</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>Envío nacional: 3-5 días hábiles</li>
                          <li>Envío internacional disponible</li>
                          <li>Seguro incluido para envíos superiores a $10,000</li>
                          <li>Recogida en persona disponible</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="sticky top-20 z-10">
              <ChatLive auctionId={auction.id} className="h-80 md:h-96" />
            </div>

            <div className="sticky top-[28rem] md:top-[32rem] z-10">
              <BidPanel auction={auction} onBidPlaced={handleBidPlaced} />
            </div>

            <div className="mt-4">
              <BidHistory auctionId={auction.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
