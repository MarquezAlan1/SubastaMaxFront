"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Globe, DollarSign, Shield, Mail } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface SystemConfig {
  siteName: string
  siteDescription: string
  supportEmail: string
  defaultCurrency: string
  buyersPremium: number
  taxRate: number
  maintenanceMode: boolean
  registrationEnabled: boolean
  emailNotifications: boolean
  smsNotifications: boolean
}

export default function AdminConfigPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [config, setConfig] = useState<SystemConfig>({
    siteName: "SubastaMax",
    siteDescription: "Plataforma líder de subastas en línea",
    supportEmail: "soporte@subastamax.com",
    defaultCurrency: "MXN",
    buyersPremium: 15,
    taxRate: 16,
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/")
      return
    }
  }, [user, router])

  const handleSave = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("Error saving config:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateConfig = (key: keyof SystemConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  if (!user || user.role !== "admin") return null

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/admin")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
              <p className="text-muted-foreground">Gestiona la configuración global de la plataforma</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Guardando..." : saved ? "Guardado!" : "Guardar Cambios"}
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="financial">Financiero</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Configuración General
                </CardTitle>
                <CardDescription>Configuración básica del sitio web</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Nombre del Sitio</Label>
                    <Input
                      id="siteName"
                      value={config.siteName}
                      onChange={(e) => updateConfig("siteName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Email de Soporte</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={config.supportEmail}
                      onChange={(e) => updateConfig("supportEmail", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Descripción del Sitio</Label>
                  <Textarea
                    id="siteDescription"
                    value={config.siteDescription}
                    onChange={(e) => updateConfig("siteDescription", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Configuración Financiera
                </CardTitle>
                <CardDescription>Configuración de comisiones, impuestos y monedas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultCurrency">Moneda por Defecto</Label>
                    <Input
                      id="defaultCurrency"
                      value={config.defaultCurrency}
                      onChange={(e) => updateConfig("defaultCurrency", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyersPremium">Comisión del Comprador (%)</Label>
                    <Input
                      id="buyersPremium"
                      type="number"
                      value={config.buyersPremium}
                      onChange={(e) => updateConfig("buyersPremium", Number.parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tasa de Impuestos (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      value={config.taxRate}
                      onChange={(e) => updateConfig("taxRate", Number.parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Configuración de Seguridad
                </CardTitle>
                <CardDescription>Configuración de acceso y mantenimiento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Modo de Mantenimiento</Label>
                    <p className="text-sm text-muted-foreground">Desactiva temporalmente el acceso público al sitio</p>
                  </div>
                  <Switch
                    checked={config.maintenanceMode}
                    onCheckedChange={(checked) => updateConfig("maintenanceMode", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Registro de Usuarios</Label>
                    <p className="text-sm text-muted-foreground">Permite que nuevos usuarios se registren</p>
                  </div>
                  <Switch
                    checked={config.registrationEnabled}
                    onCheckedChange={(checked) => updateConfig("registrationEnabled", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Configuración de Notificaciones
                </CardTitle>
                <CardDescription>Configuración de notificaciones del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones por Email</Label>
                    <p className="text-sm text-muted-foreground">Envía notificaciones importantes por email</p>
                  </div>
                  <Switch
                    checked={config.emailNotifications}
                    onCheckedChange={(checked) => updateConfig("emailNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones por SMS</Label>
                    <p className="text-sm text-muted-foreground">Envía notificaciones urgentes por SMS</p>
                  </div>
                  <Switch
                    checked={config.smsNotifications}
                    onCheckedChange={(checked) => updateConfig("smsNotifications", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
