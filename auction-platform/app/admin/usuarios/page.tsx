"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowLeft, Search, MoreHorizontal, UserCheck, UserX, Shield, Eye } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "subastador" | "participante"
  plan: "free" | "pro" | "enterprise"
  status: "active" | "suspended" | "pending"
  joinDate: Date
  lastActivity: Date
  totalBids: number
  totalSpent: number
}

export default function AdminUsersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/")
      return
    }
    loadUsers()
  }, [user, router])

  const loadUsers = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUsers: User[] = [
        {
          id: "1",
          name: "María González",
          email: "maria@example.com",
          role: "participante",
          plan: "free",
          status: "active",
          joinDate: new Date("2024-01-15"),
          lastActivity: new Date("2024-01-20"),
          totalBids: 45,
          totalSpent: 125000,
        },
        {
          id: "2",
          name: "Carlos Ruiz",
          email: "carlos@example.com",
          role: "subastador",
          plan: "pro",
          status: "active",
          joinDate: new Date("2023-11-20"),
          lastActivity: new Date("2024-01-19"),
          totalBids: 0,
          totalSpent: 0,
        },
        {
          id: "3",
          name: "Ana López",
          email: "ana@example.com",
          role: "participante",
          plan: "pro",
          status: "suspended",
          joinDate: new Date("2024-01-10"),
          lastActivity: new Date("2024-01-18"),
          totalBids: 23,
          totalSpent: 75000,
        },
      ]

      setUsers(mockUsers)
    } catch (error) {
      console.error("Error loading users:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: User["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspendido</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
    }
  }

  const getRoleBadge = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return <Badge variant="destructive">Admin</Badge>
      case "subastador":
        return <Badge variant="secondary">Subastador</Badge>
      case "participante":
        return <Badge variant="outline">Participante</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount)
  }

  if (!user || user.role !== "admin") return null

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.push("/admin")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">Administra usuarios, roles y permisos</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Usuarios Registrados</CardTitle>
                <CardDescription>Lista completa de usuarios en la plataforma</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                <p>Cargando usuarios...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Pujas</TableHead>
                    <TableHead>Total Gastado</TableHead>
                    <TableHead>Última Actividad</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {user.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.totalBids}</TableCell>
                      <TableCell>{formatCurrency(user.totalSpent)}</TableCell>
                      <TableCell>{user.lastActivity.toLocaleDateString("es-MX")}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Perfil
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="mr-2 h-4 w-4" />
                              Cambiar Rol
                            </DropdownMenuItem>
                            {user.status === "active" ? (
                              <DropdownMenuItem className="text-red-600">
                                <UserX className="mr-2 h-4 w-4" />
                                Suspender
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="text-green-600">
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activar
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
