"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, Calendar, DollarSign, Settings, Info } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface AuctionFormData {
  title: string
  description: string
  category: string
  startingBid: string
  increment: string
  startDate: string
  startTime: string
  duration: string
  autoExtend: boolean
  featured: boolean
  imageUrl: string
  videoUrl: string
}

export default function CreateAuctionPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState<AuctionFormData>({
    title: "",
    description: "",
    category: "",
    startingBid: "",
    increment: "",
    startDate: "",
    startTime: "",
    duration: "60",
    autoExtend: true,
    featured: false,
    imageUrl: "",
    videoUrl: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const categories = [
    { value: "arte", label: "Arte y Antigüedades" },
    { value: "vehiculos", label: "Vehículos" },
    { value: "joyeria", label: "Joyería y Relojes" },
    { value: "electronica", label: "Electrónicos" },
    { value: "inmuebles", label: "Inmuebles" },
    { value: "coleccionables", label: "Coleccionables" },
    { value: "otros", label: "Otros" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!formData.title || !formData.description || !formData.category) {
      setError("Por favor completa todos los campos obligatorios")
      return
    }

    if (Number.parseFloat(formData.startingBid) <= 0) {
      setError("El precio inicial debe ser mayor a 0")
      return
    }

    if (Number.parseFloat(formData.increment) <= 0) {
      setError("El incremento debe ser mayor a 0")
      return
    }

    // Check plan limitations
    if (user?.plan === "free") {
      // In a real app, you'd check current active auctions
      // For demo, we'll just show a warning
      console.log("Free plan limitations would be checked here")
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, you'd call the API to create the auction
      console.log("Creating auction:", formData)

      router.push("/subastador")
    } catch (err) {
      setError("Error al crear la subasta. Intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (field: keyof AuctionFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!user || (user.role !== "subastador" && user.role !== "admin")) {
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
            <h1 className="text-3xl font-bold">Crear Nueva Subasta</h1>
            <p className="text-muted-foreground">Configura todos los detalles de tu subasta</p>
          </div>
        </div>

        {/* Plan Limitations */}
        {user.plan === "free" && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Plan Gratuito: Máximo 1 subasta activa y 50 participantes simultáneos. Las subastas destacadas requieren
              plan Pro.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Información Básica</CardTitle>
                  <CardDescription>Detalles principales de tu subasta</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título de la Subasta *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => updateFormData("title", e.target.value)}
                      placeholder="Ej: Arte Contemporáneo - Colección Privada"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => updateFormData("description", e.target.value)}
                      placeholder="Describe detalladamente los productos de la subasta..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría *</Label>
                    <Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Configuración de Precios
                  </CardTitle>
                  <CardDescription>Define los precios y incrementos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startingBid">Precio Inicial (MXN) *</Label>
                      <Input
                        id="startingBid"
                        type="number"
                        value={formData.startingBid}
                        onChange={(e) => updateFormData("startingBid", e.target.value)}
                        placeholder="5000"
                        min="1"
                        step="100"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="increment">Incremento Mínimo (MXN) *</Label>
                      <Input
                        id="increment"
                        type="number"
                        value={formData.increment}
                        onChange={(e) => updateFormData("increment", e.target.value)}
                        placeholder="500"
                        min="1"
                        step="50"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Scheduling */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Programación
                  </CardTitle>
                  <CardDescription>Define cuándo se realizará la subasta</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Fecha de Inicio *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => updateFormData("startDate", e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startTime">Hora de Inicio *</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => updateFormData("startTime", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duración (minutos)</Label>
                    <Select value={formData.duration} onValueChange={(value) => updateFormData("duration", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="60">1 hora</SelectItem>
                        <SelectItem value="90">1.5 horas</SelectItem>
                        <SelectItem value="120">2 horas</SelectItem>
                        <SelectItem value="180">3 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Media */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Medios
                  </CardTitle>
                  <CardDescription>Imágenes y video para tu subasta</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">URL de Imagen Principal</Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => updateFormData("imageUrl", e.target.value)}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videoUrl">URL de Streaming (Opcional)</Label>
                    <Input
                      id="videoUrl"
                      value={formData.videoUrl}
                      onChange={(e) => updateFormData("videoUrl", e.target.value)}
                      placeholder="https://streaming.ejemplo.com/live"
                    />
                    <p className="text-xs text-muted-foreground">
                      Configura tu URL de streaming para transmisión en vivo
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Advanced Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuración Avanzada
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-extensión</Label>
                      <p className="text-xs text-muted-foreground">Extiende 2 min si hay pujas en los últimos 30s</p>
                    </div>
                    <Switch
                      checked={formData.autoExtend}
                      onCheckedChange={(checked) => updateFormData("autoExtend", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Subasta Destacada</Label>
                      <p className="text-xs text-muted-foreground">Mayor visibilidad en el catálogo</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.plan === "free" && <Badge variant="outline">Pro</Badge>}
                      <Switch
                        checked={formData.featured}
                        onCheckedChange={(checked) => updateFormData("featured", checked)}
                        disabled={user.plan === "free"}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Vista Previa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="aspect-video bg-muted rounded flex items-center justify-center">
                      {formData.imageUrl ? (
                        <img
                          src={formData.imageUrl || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                          }}
                        />
                      ) : (
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="font-semibold truncate">{formData.title || "Título de la subasta"}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {formData.description || "Descripción de la subasta"}
                    </p>
                    {formData.startingBid && (
                      <p className="text-lg font-bold text-primary">
                        {new Intl.NumberFormat("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        }).format(Number.parseFloat(formData.startingBid))}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Creando..." : "Crear Subasta"}
                </Button>

                <Button type="button" variant="outline" className="w-full bg-transparent" onClick={() => router.back()}>
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
