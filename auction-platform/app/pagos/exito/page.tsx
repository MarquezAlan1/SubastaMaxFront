"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, Mail, Package } from "lucide-react"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const [orderNumber] = useState(() => `ORD-${Date.now().toString().slice(-8)}`)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-green-600">¡Pago Exitoso!</h1>
            <p className="text-xl text-muted-foreground">Tu compra ha sido procesada correctamente</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">Número de orden:</span>
              <Badge variant="outline" className="font-mono">
                {orderNumber}
              </Badge>
            </div>
          </div>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles de tu Compra</CardTitle>
              <CardDescription>Resumen de los artículos adquiridos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0">
                  <img
                    src="/contemporary-art-auction.jpg"
                    alt="Artwork"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold">Obra de Arte Contemporáneo</h3>
                  <p className="text-sm text-muted-foreground">Subasta #AUC-001</p>
                  <p className="font-medium text-primary">$15,750 MXN</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Próximos Pasos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <Mail className="h-8 w-8 mx-auto text-primary" />
                  <h3 className="font-semibold">Confirmación por Email</h3>
                  <p className="text-sm text-muted-foreground">Recibirás un email con los detalles de tu compra</p>
                </div>
                <div className="space-y-2">
                  <Package className="h-8 w-8 mx-auto text-primary" />
                  <h3 className="font-semibold">Preparación del Envío</h3>
                  <p className="text-sm text-muted-foreground">
                    Tu artículo será preparado para envío en 2-3 días hábiles
                  </p>
                </div>
                <div className="space-y-2">
                  <Download className="h-8 w-8 mx-auto text-primary" />
                  <h3 className="font-semibold">Certificado de Autenticidad</h3>
                  <p className="text-sm text-muted-foreground">Descarga tu certificado desde tu perfil</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => router.push("/perfil/compras")} variant="outline">
              Ver Mis Compras
            </Button>
            <Button onClick={() => router.push("/catalogo")}>Continuar Comprando</Button>
          </div>

          {/* Support */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">¿Tienes alguna pregunta sobre tu compra?</p>
            <Button variant="link" onClick={() => router.push("/soporte")}>
              Contactar Soporte
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
