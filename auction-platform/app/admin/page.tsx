"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Gavel,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Eye,
  BarChart3,
  PieChart,
  Activity,
  Search,
  Plus,
  MoreHorizontal,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

interface AdminStats {
  totalUsers: number
  activeAuctions: number
  totalRevenue: number
  monthlyGrowth: number
  pendingApprovals: number
  liveViewers: number
  todayTransactions: number
  averageAuctionValue: number
}

interface RecentActivity {
  id: string
  type: "user_registration" | "auction_created" | "bid_placed" | "payment_completed"
  description: string
  timestamp: Date
  amount?: number
}

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "subastador" | "participante"
  reputation: number
  strikes: number
  status: "active" | "suspended" | "pending"
}

interface Auction {
  id: string
  title: string
  status: "live" | "upcoming" | "ended"
  currentBid: number
  participants: number
  views: number
  bids: number
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeAuctions: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    pendingApprovals: 0,
    liveViewers: 0,
    todayTransactions: 0,
    averageAuctionValue: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/")
      return
    }
    loadDashboardData()
  }, [user, router])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      // Simulate API calls for admin data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setStats({
        totalUsers: 15847,
        activeAuctions: 234,
        totalRevenue: 2847500,
        monthlyGrowth: 12.5,
        pendingApprovals: 18,
        liveViewers: 1247,
        todayTransactions: 89,
        averageAuctionValue: 8750,
      })

      setRecentActivity([
        {
          id: "1",
          type: "user_registration",
          description: "Nuevo usuario registrado: María González",
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
        },
        {
          id: "2",
          type: "auction_created",
          description: "Nueva subasta creada: Arte Contemporáneo",
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
        },
        {
          id: "3",
          type: "bid_placed",
          description: "Puja de $25,000 en Subasta #AUC-456",
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          amount: 25000,
        },
        {
          id: "4",
          type: "payment_completed",
          description: "Pago completado por $15,750",
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          amount: 15750,
        },
      ])

      setUsers([
        {
          id: "1",
          name: "María González",
          email: "maria@example.com",
          role: "participante",
          reputation: 4.8,
          strikes: 0,
          status: "active",
        },
        {
          id: "2",
          name: "Carlos Ruiz",
          email: "carlos@example.com",
          role: "subastador",
          reputation: 4.9,
          strikes: 0,
          status: "active",
        },
        {
          id: "3",
          name: "Ana López",
          email: "ana@example.com",
          role: "participante",
          reputation: 3.2,
          strikes: 2,
          status: "suspended",
        },
      ])

      setAuctions([
        {
          id: "AUC-001",
          title: "Pintura Abstracta Moderna",
          status: "live",
          currentBid: 25000,
          participants: 12,
          views: 245,
          bids: 34,
        },
        {
          id: "AUC-002",
          title: "Reloj Vintage Omega",
          status: "upcoming",
          currentBid: 0,
          participants: 0,
          views: 89,
          bids: 0,
        },
        {
          id: "AUC-003",
          title: "Escultura de Bronce",
          status: "ended",
          currentBid: 45000,
          participants: 8,
          views: 156,
          bids: 23,
        },
      ])
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-MX").format(num)
  }

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "user_registration":
        return <Users className="h-4 w-4" />
      case "auction_created":
        return <Gavel className="h-4 w-4" />
      case "bid_placed":
        return <TrendingUp className="h-4 w-4" />
      case "payment_completed":
        return <DollarSign className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: RecentActivity["type"]) => {
    switch (type) {
      case "user_registration":
        return "text-blue-600"
      case "auction_created":
        return "text-green-600"
      case "bid_placed":
        return "text-orange-600"
      case "payment_completed":
        return "text-purple-600"
    }
  }

  if (!user || user.role !== "admin") return null

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p>Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
            <p className="text-muted-foreground">Gestiona y monitorea la plataforma SubastaMax</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600 border-green-600">
              <Activity className="h-3 w-3 mr-1" />
              Sistema Operativo
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="auctions">Subastas</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(stats.totalUsers)}</div>
                  <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Subastas Activas</CardTitle>
                  <Gavel className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeAuctions}</div>
                  <p className="text-xs text-muted-foreground">+8% desde la semana pasada</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground">+{stats.monthlyGrowth}% este mes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Espectadores en Vivo</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(stats.liveViewers)}</div>
                  <p className="text-xs text-muted-foreground">Ahora mismo</p>
                </CardContent>
              </Card>
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Transacciones Hoy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.todayTransactions}</div>
                  <p className="text-xs text-muted-foreground">Pagos completados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Valor Promedio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats.averageAuctionValue)}</div>
                  <p className="text-xs text-muted-foreground">Por subasta</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    Pendientes de Aprobación
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.pendingApprovals}</div>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    Revisar
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Últimas acciones en la plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                      <div className={`${getActivityColor(activity.type)}`}>{getActivityIcon(activity.type)}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.timestamp.toLocaleTimeString("es-MX", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {activity.amount && (
                        <div className="text-sm font-medium text-green-600">{formatCurrency(activity.amount)}</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestión de Usuarios</CardTitle>
                    <CardDescription>Administra usuarios, roles y permisos</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Buscar usuarios..." className="pl-10 w-64" />
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Usuario
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <select className="px-3 py-2 border rounded-md text-sm">
                      <option value="">Todos los roles</option>
                      <option value="admin">Admin</option>
                      <option value="subastador">Subastador</option>
                      <option value="participante">Participante</option>
                    </select>
                    <select className="px-3 py-2 border rounded-md text-sm">
                      <option value="">Todos los estados</option>
                      <option value="active">Activo</option>
                      <option value="suspended">Suspendido</option>
                      <option value="pending">Pendiente</option>
                    </select>
                    <select className="px-3 py-2 border rounded-md text-sm">
                      <option value="">Reputación</option>
                      <option value="high">Alta (4.5+)</option>
                      <option value="medium">Media (3.0-4.4)</option>
                      <option value="low">Baja (&lt;3.0)</option>
                    </select>
                    <select className="px-3 py-2 border rounded-md text-sm">
                      <option value="">Strikes</option>
                      <option value="none">Sin strikes</option>
                      <option value="warning">1-2 strikes</option>
                      <option value="danger">3+ strikes</option>
                    </select>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="border-b bg-muted/50">
                        <tr>
                          <th className="text-left p-4 font-medium">Usuario</th>
                          <th className="text-left p-4 font-medium">Rol</th>
                          <th className="text-left p-4 font-medium">Reputación</th>
                          <th className="text-left p-4 font-medium">Strikes</th>
                          <th className="text-left p-4 font-medium">Estado</th>
                          <th className="text-left p-4 font-medium">Última Actividad</th>
                          <th className="text-left p-4 font-medium">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-muted/25">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium">{user.name.charAt(0)}</span>
                                </div>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-sm text-muted-foreground">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge
                                variant={
                                  user.role === "admin"
                                    ? "destructive"
                                    : user.role === "subastador"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {user.role}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <span className="text-sm font-medium">{user.reputation}</span>
                                  <span className="text-yellow-500">★</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  ({Math.floor(Math.random() * 100) + 50} reviews)
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Badge variant={user.strikes > 0 ? "destructive" : "outline"}>
                                  {user.strikes} strikes
                                </Badge>
                                {user.strikes > 2 && <AlertTriangle className="h-4 w-4 text-red-500" />}
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge
                                variant={
                                  user.status === "active"
                                    ? "default"
                                    : user.status === "suspended"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {user.status === "active"
                                  ? "Activo"
                                  : user.status === "suspended"
                                    ? "Suspendido"
                                    : "Pendiente"}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="text-sm text-muted-foreground">
                                Hace {Math.floor(Math.random() * 24) + 1}h
                              </div>
                            </td>
                            <td className="p-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Ver Perfil Completo</DropdownMenuItem>
                                  <DropdownMenuItem>Historial de Pujas</DropdownMenuItem>
                                  <DropdownMenuItem>Cambiar Rol</DropdownMenuItem>
                                  <DropdownMenuItem>Editar Usuario</DropdownMenuItem>
                                  <DropdownMenuItem>Resetear Contraseña</DropdownMenuItem>
                                  <DropdownMenuItem>Agregar Strike</DropdownMenuItem>
                                  <DropdownMenuItem
                                    className={user.status === "active" ? "text-red-600" : "text-green-600"}
                                  >
                                    {user.status === "active" ? "Suspender Usuario" : "Activar Usuario"}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">Mostrando 1-3 de 15,847 usuarios</p>
                      <select className="px-2 py-1 border rounded text-sm">
                        <option value="10">10 por página</option>
                        <option value="25">25 por página</option>
                        <option value="50">50 por página</option>
                        <option value="100">100 por página</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled>
                        Anterior
                      </Button>
                      <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                        1
                      </Button>
                      <Button variant="outline" size="sm">
                        2
                      </Button>
                      <Button variant="outline" size="sm">
                        3
                      </Button>
                      <span className="text-sm text-muted-foreground">...</span>
                      <Button variant="outline" size="sm">
                        1,585
                      </Button>
                      <Button variant="outline" size="sm">
                        Siguiente
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auctions" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestión de Subastas</CardTitle>
                    <CardDescription>Moderar, aprobar y gestionar todas las subastas</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Buscar subastas..." className="pl-10 w-64" />
                    </div>
                    <Button variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Subastas Activas</p>
                            <p className="text-2xl font-bold text-green-600">{stats.activeAuctions}</p>
                          </div>
                          <Activity className="h-8 w-8 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Volumen de Pujas</p>
                            <p className="text-2xl font-bold text-blue-600">1,247</p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Usuarios Conectados</p>
                            <p className="text-2xl font-bold text-purple-600">{stats.liveViewers}</p>
                          </div>
                          <Users className="h-8 w-8 text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Valor Total</p>
                            <p className="text-2xl font-bold text-orange-600">{formatCurrency(stats.totalRevenue)}</p>
                          </div>
                          <DollarSign className="h-8 w-8 text-orange-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    <select className="px-3 py-2 border rounded-md text-sm">
                      <option value="">Todos los estados</option>
                      <option value="upcoming">Próximas</option>
                      <option value="live">En vivo</option>
                      <option value="ended">Finalizadas</option>
                      <option value="paused">Pausadas</option>
                      <option value="cancelled">Canceladas</option>
                    </select>
                    <select className="px-3 py-2 border rounded-md text-sm">
                      <option value="">Todas las categorías</option>
                      <option value="arte">Arte</option>
                      <option value="joyas">Joyas</option>
                      <option value="coleccionables">Coleccionables</option>
                      <option value="vehiculos">Vehículos</option>
                      <option value="inmuebles">Inmuebles</option>
                    </select>
                    <select className="px-3 py-2 border rounded-md text-sm">
                      <option value="">Rango de precio</option>
                      <option value="low">$0 - $10,000</option>
                      <option value="medium">$10,000 - $100,000</option>
                      <option value="high">$100,000+</option>
                    </select>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="border-b bg-muted/50">
                        <tr>
                          <th className="text-left p-4 font-medium">Subasta</th>
                          <th className="text-left p-4 font-medium">Estado</th>
                          <th className="text-left p-4 font-medium">Puja Actual</th>
                          <th className="text-left p-4 font-medium">Participantes</th>
                          <th className="text-left p-4 font-medium">Analytics</th>
                          <th className="text-left p-4 font-medium">Tiempo Restante</th>
                          <th className="text-left p-4 font-medium">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auctions.map((auction) => (
                          <tr key={auction.id} className="border-b hover:bg-muted/25">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                  <Gavel className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div>
                                  <div className="font-medium">{auction.title}</div>
                                  <div className="text-sm text-muted-foreground">{auction.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    auction.status === "live"
                                      ? "default"
                                      : auction.status === "upcoming"
                                        ? "secondary"
                                        : "outline"
                                  }
                                >
                                  {auction.status === "live"
                                    ? "En Vivo"
                                    : auction.status === "upcoming"
                                      ? "Próxima"
                                      : "Finalizada"}
                                </Badge>
                                {auction.status === "live" && (
                                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <div>
                                <div className="font-medium">{formatCurrency(auction.currentBid)}</div>
                                <div className="text-xs text-muted-foreground">Incremento: {formatCurrency(5000)}</div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{auction.participants}</span>
                                <div className="text-xs text-muted-foreground">
                                  ({Math.floor(Math.random() * 50) + 10} conectados)
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="text-sm space-y-1">
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  <span>{auction.views} vistas</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  <span>{auction.bids} pujas</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              {auction.status === "live" ? (
                                <div className="text-sm">
                                  <div className="font-medium text-red-600">
                                    {Math.floor(Math.random() * 30) + 5}m {Math.floor(Math.random() * 60)}s
                                  </div>
                                  <div className="text-xs text-muted-foreground">restantes</div>
                                </div>
                              ) : auction.status === "upcoming" ? (
                                <div className="text-sm">
                                  <div className="font-medium">{Math.floor(Math.random() * 24) + 1}h</div>
                                  <div className="text-xs text-muted-foreground">para iniciar</div>
                                </div>
                              ) : (
                                <div className="text-sm text-muted-foreground">Finalizada</div>
                              )}
                            </td>
                            <td className="p-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Ver Detalles Completos</DropdownMenuItem>
                                  <DropdownMenuItem>Analytics Avanzados</DropdownMenuItem>
                                  {auction.status === "live" && (
                                    <>
                                      <DropdownMenuItem className="text-orange-600">Pausar Subasta</DropdownMenuItem>
                                      <DropdownMenuItem>Extender Tiempo (+10min)</DropdownMenuItem>
                                      <DropdownMenuItem>Fijar Incremento Mínimo</DropdownMenuItem>
                                      <DropdownMenuItem>Forzar Cierre</DropdownMenuItem>
                                    </>
                                  )}
                                  {auction.status === "upcoming" && (
                                    <>
                                      <DropdownMenuItem className="text-green-600">Iniciar Ahora</DropdownMenuItem>
                                      <DropdownMenuItem>Editar Configuración</DropdownMenuItem>
                                    </>
                                  )}
                                  {auction.status === "ended" && (
                                    <>
                                      <DropdownMenuItem>Reasignar Ganador</DropdownMenuItem>
                                      <DropdownMenuItem>Ver Reporte Final</DropdownMenuItem>
                                    </>
                                  )}
                                  <DropdownMenuItem>Duplicar Subasta</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">Cancelar/Eliminar</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">Mostrando 1-3 de 234 subastas</p>
                      <select className="px-2 py-1 border rounded text-sm">
                        <option value="10">10 por página</option>
                        <option value="25">25 por página</option>
                        <option value="50">50 por página</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled>
                        Anterior
                      </Button>
                      <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                        1
                      </Button>
                      <Button variant="outline" size="sm">
                        2
                      </Button>
                      <Button variant="outline" size="sm">
                        3
                      </Button>
                      <span className="text-sm text-muted-foreground">...</span>
                      <Button variant="outline" size="sm">
                        24
                      </Button>
                      <Button variant="outline" size="sm">
                        Siguiente
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Ingresos por Mes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Gráfico de ingresos mensuales</p>
                    <div className="h-32 bg-muted/50 rounded-lg mt-4 flex items-center justify-center">
                      <BarChart3 className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Categorías Populares
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Distribución por categorías</p>
                    <div className="h-32 bg-muted/50 rounded-lg mt-4 flex items-center justify-center">
                      <PieChart className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Métricas Avanzadas</CardTitle>
                <CardDescription>Analytics detallados y reportes personalizados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Analytics Avanzados</h3>
                  <p className="text-muted-foreground mb-4">
                    Reportes detallados, métricas de conversión y análisis predictivo
                  </p>
                  <Button>Próximamente</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
