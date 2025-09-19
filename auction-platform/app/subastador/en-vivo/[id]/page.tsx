"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoPlayer } from "@/components/video-player"
import { Timer } from "@/components/timer"
import { ChatLive } from "@/components/chat-live"
import { BidHistory } from "@/components/bid-history"
import { LiveBadge } from "@/components/live-badge"
import {
  ArrowLeft,
  Users,
  Eye,
  Settings,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Pause,
  Play,
  Square,
  AlertTriangle,
} from "lucide-react"
import { AuctionAPI } from "@/lib/api"
import type { Auction } from "@/lib/store"
import { useAuth } from "@/lib/auth-context"

export default function LiveAuctionRoomPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [auction, setAuction] = useState<Auction | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [viewerCount, setViewerCount] = useState(0)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamSettings, setStreamSettings] = useState({
    micEnabled: true,
    cameraEnabled: true,
    screenShare: false,
  })

  useEffect(() => {
    if (!user || (user.role !== "subastador" && user.role !== "admin")) {
      router.push("/login")
      return
    }

    loadAuction()
  }, [params.id, user, router])

  useEffect(() => {
    if (!auction) return

    // Simulate WebSocket connection for real-time updates
    const cleanup = AuctionAPI.simulateWebSocket(auction.id, (data) => {
      if (data.type === "participants_update") {
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
        // Auto-start streaming if auction is live
        if (data.status === "live") {
          setIsStreaming(true)
        }
      } else {
        setError("Subasta no encontrada")
      }
    } catch (err) {
      setError("Error al cargar la subasta")
    } finally {
      setLoading(false)
    }
  }

  const toggleStreaming = () => {
    setIsStreaming(!isStreaming)
    // In a real app, this would start/stop the actual stream
  }

  const toggleMic = () => {
    setStreamSettings((prev) => ({ ...prev, micEnabled: !prev.micEnabled }))
  }

  const toggleCamera = () => {
    setStreamSettings((prev) => ({ ...prev, cameraEnabled: !prev.cameraEnabled }))
  }

  const toggleScreenShare = () => {
    setStreamSettings((prev) => ({ ...prev, screenShare: !prev.screenShare }))
  }

  const endAuction = () => {
    if (auction && window.confirm("¿Estás seguro de que quieres finalizar la subasta?")) {
      setAuction({ ...auction, status: "ended" })
      setIsStreaming(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p>Cargando sala de subasta...</p>
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold">{auction.title}</h1>
                {auction.status === "live" && <LiveBadge />}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{viewerCount} participantes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>Sala del Subastador</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stream Controls */}
          <div className="flex items-center gap-2">
            <Button variant={streamSettings.micEnabled ? "default" : "destructive"} size="sm" onClick={toggleMic}>
              {streamSettings.micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>
            <Button variant={streamSettings.cameraEnabled ? "default" : "destructive"} size="sm" onClick={toggleCamera}>
              {streamSettings.cameraEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={toggleScreenShare}>
              <Monitor className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Status Alert */}
        {auction.status !== "live" && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {auction.status === "upcoming"
                ? "La subasta aún no ha comenzado. Puedes preparar tu transmisión."
                : "La subasta ha finalizado."}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Video and Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Stream */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Transmisión en Vivo</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={isStreaming ? "default" : "secondary"}>
                      {isStreaming ? "EN VIVO" : "DESCONECTADO"}
                    </Badge>
                    {auction.status === "live" && <Timer endTime={auction.endTime} size="sm" />}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <VideoPlayer videoUrl={auction.videoUrl} isLive={isStreaming} viewerCount={viewerCount} />

                {/* Stream Controls */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  {auction.status === "live" ? (
                    <>
                      <Button variant={isStreaming ? "destructive" : "default"} onClick={toggleStreaming}>
                        {isStreaming ? (
                          <>
                            <Pause className="mr-2 h-4 w-4" />
                            Pausar Stream
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Iniciar Stream
                          </>
                        )}
                      </Button>
                      <Button variant="destructive" onClick={endAuction}>
                        <Square className="mr-2 h-4 w-4" />
                        Finalizar Subasta
                      </Button>
                    </>
                  ) : (
                    <Button disabled>
                      <Square className="mr-2 h-4 w-4" />
                      Subasta No Activa
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Auctioneer Tools */}
            <Tabs defaultValue="bids" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="bids">Pujas</TabsTrigger>
                <TabsTrigger value="participants">Participantes</TabsTrigger>
                <TabsTrigger value="settings">Configuración</TabsTrigger>
              </TabsList>

              <TabsContent value="bids">
                <BidHistory auctionId={auction.id} />
              </TabsContent>

              <TabsContent value="participants">
                <Card>
                  <CardHeader>
                    <CardTitle>Participantes Conectados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">{viewerCount} Participantes</h3>
                      <p className="text-muted-foreground">Lista detallada disponible en plan Pro</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración de Transmisión</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Calidad de Video</label>
                        <select className="w-full p-2 border rounded">
                          <option>1080p (Recomendado)</option>
                          <option>720p</option>
                          <option>480p</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Bitrate</label>
                        <select className="w-full p-2 border rounded">
                          <option>Auto</option>
                          <option>2500 kbps</option>
                          <option>1500 kbps</option>
                        </select>
                      </div>
                    </div>
                    <Button className="w-full">Aplicar Configuración</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Chat and Info */}
          <div className="space-y-6">
            {/* Current Bid Info */}
            <Card>
              <CardHeader>
                <CardTitle>Estado Actual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Puja actual</p>
                  <p className="text-3xl font-bold text-primary">
                    {new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    }).format(auction.currentBid)}
                  </p>
                  <p className="text-sm text-muted-foreground">{auction.bidCount} pujas</p>
                </div>
              </CardContent>
            </Card>

            {/* Live Chat */}
            <ChatLive auctionId={auction.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
