"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Building2, CreditCard, MoreHorizontal, UserPlus, Crown } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface Organization {
  id: string
  name: string
  description: string
  plan: "free" | "pro" | "enterprise"
  memberCount: number
  createdAt: Date
  owner: string
}

interface Member {
  id: string
  name: string
  email: string
  role: "owner" | "admin" | "member"
  joinedAt: Date
  lastActive: Date
}

export default function OrganizationPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    loadOrganizationData()
  }, [user, router])

  const loadOrganizationData = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock organization data
      setOrganization({
        id: "org-1",
        name: "Casa de Subastas Premium",
        description: "Especialistas en arte contemporáneo y antigüedades",
        plan: "pro",
        memberCount: 8,
        createdAt: new Date("2023-06-15"),
        owner: user?.id || "",
      })

      setMembers([
        {
          id: "1",
          name: user?.name || "Usuario",
          email: user?.email || "usuario@example.com",
          role: "owner",
          joinedAt: new Date("2023-06-15"),
          lastActive: new Date(),
        },
        {
          id: "2",
          name: "Ana García",
          email: "ana@example.com",
          role: "admin",
          joinedAt: new Date("2023-07-01"),
          lastActive: new Date("2024-01-19"),
        },
        {
          id: "3",
          name: "Carlos López",
          email: "carlos@example.com",
          role: "member",
          joinedAt: new Date("2023-08-15"),
          lastActive: new Date("2024-01-18"),
        },
      ])
    } catch (error) {
      console.error("Error loading organization:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadge = (role: Member["role"]) => {
    switch (role) {
      case "owner":
        return <Badge className="bg-purple-100 text-purple-800">Propietario</Badge>
      case "admin":
        return <Badge className="bg-blue-100 text-blue-800">Administrador</Badge>
      case "member":
        return <Badge variant="outline">Miembro</Badge>
    }
  }

  const getPlanBadge = (plan: Organization["plan"]) => {
    switch (plan) {
      case "free":
        return <Badge variant="outline">Gratuito</Badge>
      case "pro":
        return <Badge className="bg-green-100 text-green-800">Profesional</Badge>
      case "enterprise":
        return <Badge className="bg-purple-100 text-purple-800">Empresarial</Badge>
    }
  }

  if (!user) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p>Cargando organización...</p>
        </div>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Crea tu Organización</h1>
            <p className="text-muted-foreground mb-8">
              Las organizaciones te permiten colaborar con tu equipo y gestionar múltiples subastas de forma
              centralizada.
            </p>
            <Button size="lg">Crear Organización</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{organization.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                {getPlanBadge(organization.plan)}
                <span className="text-sm text-muted-foreground">{organization.memberCount} miembros</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push("/planes")}>
              <Crown className="h-4 w-4 mr-2" />
              Actualizar Plan
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="members">Miembros</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
            <TabsTrigger value="billing">Facturación</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Miembros Activos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{organization.memberCount}</div>
                  <p className="text-xs text-muted-foreground">+2 este mes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Subastas Activas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+3 esta semana</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,230</div>
                  <p className="text-xs text-muted-foreground">+15% vs mes anterior</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Información de la Organización</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Descripción</Label>
                    <p className="text-sm text-muted-foreground mt-1">{organization.description}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Creada</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {organization.createdAt.toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Miembros del Equipo</CardTitle>
                    <CardDescription>Gestiona los miembros de tu organización</CardDescription>
                  </div>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invitar Miembro
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Miembro</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Se Unió</TableHead>
                      <TableHead>Última Actividad</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">{member.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(member.role)}</TableCell>
                        <TableCell>{member.joinedAt.toLocaleDateString("es-MX")}</TableCell>
                        <TableCell>{member.lastActive.toLocaleDateString("es-MX")}</TableCell>
                        <TableCell>
                          {member.role !== "owner" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Cambiar Rol</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Remover</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de la Organización</CardTitle>
                <CardDescription>Actualiza la información de tu organización</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Nombre de la Organización</Label>
                  <Input id="orgName" defaultValue={organization.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgDescription">Descripción</Label>
                  <Textarea id="orgDescription" defaultValue={organization.description} rows={3} />
                </div>
                <Button>Guardar Cambios</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Facturación y Suscripción
                </CardTitle>
                <CardDescription>Gestiona tu plan y métodos de pago</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h3 className="font-semibold">Plan Actual: Profesional</h3>
                    <p className="text-sm text-muted-foreground">$2,999 MXN/mes • Renovación: 15 Feb 2024</p>
                  </div>
                  <Button variant="outline">Cambiar Plan</Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Historial de Facturación</h4>
                  <div className="text-center py-8 text-muted-foreground">
                    <CreditCard className="h-12 w-12 mx-auto mb-4" />
                    <p>No hay facturas disponibles</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
