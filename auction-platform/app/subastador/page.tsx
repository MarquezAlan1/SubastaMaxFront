"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Gavel, Package, BarChart3, Users, Clock, TrendingUp, Eye, Settings } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuctionCard } from "@/components/auction-card"
import { AuctionAPI } from "@/lib/api"
import type { Auction } from "@/lib/store"

export default function AuctioneerDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalAuctions: 0,
    activeAuctions: 0,
    totalRevenue: 0,
    totalBids: 0,
    avgParticipants: 0,
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== "subastador" && user.role !== "admin") {
      router.push("/")
      return
    }

    loadAuctioneerData()
  }, [user, router])

  const loadAuctioneerData = async () => {
    try {
      setLoading(true)
      const allAuctions = await AuctionAPI.getAuctions()
      const myAuctions = allAuctions.filter((auction) => auction.auctioneerId === user?.id)
      setAuctions(myAuctions)

      // Calculate stats
      const totalRevenue = myAuctions.reduce((sum, auction) => sum + auction.currentBid, 0)
      const totalBids = myAuctions.reduce((sum, auction) => sum + auction.bidCount, 0)
      const avgParticipants =
        myAuctions.length > 0
          ? myAuctions.reduce((sum, auction) => sum + auction.participants, 0) / myAuctions.length
          : 0

      setStats({
        totalAuctions: myAuctions.length,
        activeAuctions: myAuctions.filter((a) => a.status === "live").length,
        totalRevenue,
        totalBids,
        avgParticipants: Math.round(avgParticipants),
      })
    } catch (error) {
      console.error("Error loading auctioneer data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price)
  }

  if (!user || (user.role !== "subastador" && user.role !== "admin")) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard de Subastador</h1>
            <p className="text-muted-foreground">Gestiona tus subastas y productos</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/subastador/crear">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Subasta
              </Button>
            </Link>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Configuración
            </Button>
          </div>
        </div>

        {/* Plan Limitations Alert */}
        {user.plan === "free" && (
          <Alert className="mb-6">
            <AlertDescription>
              Plan Gratuito: Puedes tener máximo 1 subasta activa y 50 participantes simultáneos.{" "}
              <Link href="/planes" className="text-primary hover:underline">
                Actualizar a Pro
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subastas</CardTitle>
              <Gavel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAuctions}</div>
              <p className="text-xs text-muted-foreground">Todas las subastas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activas</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeAuctions}</div>
              <p className="text-xs text-muted-foreground">En vivo ahora</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">Valor actual</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pujas</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBids}</div>
              <p className="text-xs text-muted-foreground">Todas las pujas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgParticipants}</div>
              <p className="text-xs text-muted-foreground">Promedio</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="auctions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="auctions">Mis Subastas</TabsTrigger>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="analytics">Analíticas</TabsTrigger>
            <TabsTrigger value="tools">Herramientas</TabsTrigger>
          </TabsList>

          <TabsContent value="auctions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Mis Subastas</h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{auctions.length} total</Badge>
                <Badge variant="secondary">{auctions.filter((a) => a.status === "live").length} activas</Badge>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="aspect-video bg-muted rounded animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-6 bg-muted rounded animate-pulse" />
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-10 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : auctions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Gavel className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No tienes subastas aún</h3>
                  <p className="text-muted-foreground mb-4 text-center">
                    Crea tu primera subasta para comenzar a vender tus productos
                  </p>
                  <Link href="/subastador/crear">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Crear Primera Subasta
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {auctions.map((auction) => (
                  <div key={auction.id} className="relative">
                    <AuctionCard auction={auction} />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Link href={`/subastador/editar/${auction.id}`}>
                        <Button size="sm" variant="secondary">
                          Editar
                        </Button>
                      </Link>
                      {auction.status === "live" && (
                        <Link href={`/subastador/en-vivo/${auction.id}`}>
                          <Button size="sm">
                            <Eye className="mr-1 h-3 w-3" />
                            Sala
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Gestión de Productos
                </CardTitle>
                <CardDescription>Administra tu inventario y lotes para subastas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Gestión de Productos</h3>
                  <p className="text-muted-foreground mb-4">
                    Funcionalidad en desarrollo. Pronto podrás gestionar tu inventario completo.
                  </p>
                  <Button variant="outline" disabled>
                    Próximamente
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analíticas Detalladas
                </CardTitle>
                <CardDescription>Métricas avanzadas de rendimiento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Analíticas Avanzadas</h3>
                  <p className="text-muted-foreground mb-4">
                    Dashboard completo con métricas detalladas, gráficos y reportes.
                  </p>
                  <Button variant="outline" disabled>
                    Próximamente
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Herramientas de Difusión</CardTitle>
                  <CardDescription>Promociona tus subastas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-transparent" variant="outline">
                    Generar Enlaces de Compartir
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    Crear Banners Promocionales
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    Exportar Lista de Participantes
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configuración de Streaming</CardTitle>
                  <CardDescription>Gestiona tu transmisión en vivo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-transparent" variant="outline">
                    Configurar Cámara
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    Probar Conexión
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    Configurar Calidad
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
