"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Star,
  Trophy,
  Gavel,
  TrendingUp,
  AlertTriangle,
  Edit3,
  Save,
  X,
  Upload,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Shield,
  Award,
  DollarSign,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  location?: string
  phone?: string
  joinDate: Date
  role: "admin" | "subastador" | "participante"
  reputation: number
  strikes: number
  totalBids: number
  auctionsWon: number
  auctionsLost: number
  totalSpent: number
  badges: string[]
  isVerified: boolean
}

interface BidHistory {
  id: string
  auctionId: string
  auctionTitle: string
  amount: number
  status: "won" | "lost" | "active"
  timestamp: Date
}

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [bidHistory, setBidHistory] = useState<BidHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    bio: "",
    location: "",
    phone: "",
  })

  const isOwnProfile = user?.id === params.id

  useEffect(() => {
    loadProfile()
  }, [params.id])

  const loadProfile = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockProfile: UserProfile = {
        id: params.id as string,
        name: isOwnProfile ? user?.name || "Usuario" : "María González",
        email: isOwnProfile ? user?.email || "usuario@example.com" : "maria@example.com",
        avatar: "/diverse-user-avatars.png",
        bio: "Coleccionista de arte contemporáneo con más de 10 años de experiencia en subastas. Especializada en pintura abstracta y escultura moderna.",
        location: "Ciudad de México, México",
        phone: "+52 55 1234 5678",
        joinDate: new Date(2020, 3, 15),
        role: isOwnProfile ? user?.role || "participante" : "participante",
        reputation: 4.8,
        strikes: 0,
        totalBids: 247,
        auctionsWon: 23,
        auctionsLost: 45,
        totalSpent: 485000,
        badges: ["Coleccionista Verificado", "Comprador Frecuente", "Arte Contemporáneo"],
        isVerified: true,
      }

      const mockBidHistory: BidHistory[] = [
        {
          id: "1",
          auctionId: "AUC-001",
          auctionTitle: "Pintura Abstracta Moderna",
          amount: 25000,
          status: "active",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          id: "2",
          auctionId: "AUC-002",
          auctionTitle: "Escultura de Bronce Vintage",
          amount: 45000,
          status: "won",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        {
          id: "3",
          auctionId: "AUC-003",
          auctionTitle: "Reloj de Colección Suizo",
          amount: 15000,
          status: "lost",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
      ]

      setProfile(mockProfile)
      setBidHistory(mockBidHistory)
      setEditForm({
        name: mockProfile.name,
        bio: mockProfile.bio || "",
        location: mockProfile.location || "",
        phone: mockProfile.phone || "",
      })
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!profile) return

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setProfile({
        ...profile,
        ...editForm,
      })
      setEditing(false)
    } catch (error) {
      console.error("Error saving profile:", error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 bg-muted rounded-full" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-64" />
                <div className="h-4 bg-muted rounded w-48" />
                <div className="h-4 bg-muted rounded w-32" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-32 bg-muted rounded" />
              <div className="h-32 bg-muted rounded" />
              <div className="h-32 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Perfil no encontrado</h1>
          <p className="text-muted-foreground mb-4">El usuario que buscas no existe o ha sido eliminado.</p>
          <Button onClick={() => router.back()}>Volver</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                  <AvatarFallback className="text-2xl">{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {isOwnProfile && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 bg-transparent"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold">{profile.name}</h1>
                      {profile.isVerified && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Verificado
                        </Badge>
                      )}
                      <Badge variant="outline" className="capitalize">
                        {profile.role}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{profile.reputation}</span>
                        <span>reputación</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Miembro desde {formatDate(profile.joinDate)}</span>
                      </div>
                      {profile.strikes > 0 && (
                        <div className="flex items-center gap-1 text-red-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span>{profile.strikes} strikes</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {profile.badges.map((badge, index) => (
                        <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                          <Award className="h-3 w-3 mr-1" />
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {isOwnProfile && (
                    <div className="flex items-center gap-2">
                      {editing ? (
                        <>
                          <Button size="sm" onClick={handleSaveProfile}>
                            <Save className="h-4 w-4 mr-2" />
                            Guardar
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                            <X className="h-4 w-4 mr-2" />
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                          <Edit3 className="h-4 w-4 mr-2" />
                          Editar Perfil
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Biografía</label>
                    {editing ? (
                      <Textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        placeholder="Cuéntanos sobre ti..."
                        className="mt-1"
                        rows={3}
                      />
                    ) : (
                      <p className="text-sm mt-1">{profile.bio || "Sin biografía"}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Ubicación</label>
                      {editing ? (
                        <Input
                          value={editForm.location}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          placeholder="Tu ubicación"
                          className="mt-1"
                        />
                      ) : (
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{profile.location || "No especificada"}</span>
                        </div>
                      )}
                    </div>

                    {isOwnProfile && (
                      <>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Email</label>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{profile.email}</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                          {editing ? (
                            <Input
                              value={editForm.phone}
                              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                              placeholder="Tu teléfono"
                              className="mt-1"
                            />
                          ) : (
                            <div className="flex items-center gap-2 mt-1">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{profile.phone || "No especificado"}</span>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Pujas</p>
                  <p className="text-2xl font-bold">{profile.totalBids}</p>
                </div>
                <Gavel className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Subastas Ganadas</p>
                  <p className="text-2xl font-bold text-green-600">{profile.auctionsWon}</p>
                </div>
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tasa de Éxito</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round((profile.auctionsWon / (profile.auctionsWon + profile.auctionsLost)) * 100)}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Invertido</p>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(profile.totalSpent)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="historial" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="historial">Historial</TabsTrigger>
            <TabsTrigger value="reputacion">Reputación</TabsTrigger>
            <TabsTrigger value="logros">Logros</TabsTrigger>
            {isOwnProfile && <TabsTrigger value="configuracion">Configuración</TabsTrigger>}
          </TabsList>

          <TabsContent value="historial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Pujas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bidHistory.map((bid) => (
                    <div key={bid.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "w-3 h-3 rounded-full",
                            bid.status === "won"
                              ? "bg-green-500"
                              : bid.status === "lost"
                                ? "bg-red-500"
                                : "bg-blue-500",
                          )}
                        />
                        <div>
                          <h4 className="font-medium">{bid.auctionTitle}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(bid.timestamp)} • {bid.auctionId}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(bid.amount)}</p>
                        <Badge
                          variant={
                            bid.status === "won" ? "default" : bid.status === "lost" ? "destructive" : "secondary"
                          }
                        >
                          {bid.status === "won" ? "Ganada" : bid.status === "lost" ? "Perdida" : "Activa"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reputacion" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sistema de Reputación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-yellow-600">{profile.reputation}</div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "h-5 w-5",
                              star <= Math.floor(profile.reputation) ? "text-yellow-500 fill-current" : "text-gray-300",
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Puntualidad en pagos</span>
                          <span>98%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "98%" }} />
                        </div>
                      </div>
                      <div className="space-y-2 mt-4">
                        <div className="flex justify-between text-sm">
                          <span>Cumplimiento de términos</span>
                          <span>95%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "95%" }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Historial de Strikes</h4>
                    {profile.strikes === 0 ? (
                      <div className="text-center py-8">
                        <Shield className="h-12 w-12 text-green-600 mx-auto mb-2" />
                        <p className="text-green-600 font-medium">¡Excelente comportamiento!</p>
                        <p className="text-sm text-muted-foreground">No tienes strikes en tu historial</p>
                      </div>
                    ) : (
                      <div className="space-y-2">{/* Strike history would go here */}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logros" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Logros y Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile.badges.map((badge, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 border rounded-lg">
                      <Award className="h-8 w-8 text-purple-600" />
                      <div>
                        <h4 className="font-medium">{badge}</h4>
                        <p className="text-sm text-muted-foreground">Obtenido el {formatDate(profile.joinDate)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {isOwnProfile && (
            <TabsContent value="configuracion" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración Rápida</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Notificaciones</h4>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm">Notificar cuando sea superado en una puja</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm">Notificar cuando una subasta esté por terminar</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Recibir newsletter semanal</span>
                        </label>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-3">Privacidad</h4>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm">Mostrar mi perfil públicamente</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Mostrar mi historial de pujas</span>
                        </label>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex gap-4">
                      <Button>Guardar Configuración</Button>
                      <Button variant="outline">Restablecer</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
