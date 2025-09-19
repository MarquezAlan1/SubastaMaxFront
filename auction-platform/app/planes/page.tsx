"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Check, Star, Zap, Crown } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface Plan {
  id: string
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  icon: React.ComponentType<{ className?: string }>
  features: string[]
  limitations: {
    maxAuctions: number | "unlimited"
    maxBidders: number | "unlimited"
    videoQuality: string
    support: string
  }
  popular?: boolean
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Gratuito",
    description: "Perfecto para comenzar",
    monthlyPrice: 0,
    yearlyPrice: 0,
    icon: Star,
    features: [
      "Hasta 5 subastas por mes",
      "Máximo 50 participantes por subasta",
      "Video en calidad estándar",
      "Soporte por email",
      "Comisión del 15%",
    ],
    limitations: {
      maxAuctions: 5,
      maxBidders: 50,
      videoQuality: "720p",
      support: "Email",
    },
  },
  {
    id: "pro",
    name: "Profesional",
    description: "Para subastadores serios",
    monthlyPrice: 2999,
    yearlyPrice: 29990,
    icon: Zap,
    popular: true,
    features: [
      "Subastas ilimitadas",
      "Hasta 500 participantes por subasta",
      "Video en alta definición",
      "Soporte prioritario",
      "Comisión del 12%",
      "Analytics avanzados",
      "Marca personalizada",
    ],
    limitations: {
      maxAuctions: "unlimited",
      maxBidders: 500,
      videoQuality: "1080p",
      support: "Chat + Email",
    },
  },
  {
    id: "enterprise",
    name: "Empresarial",
    description: "Para organizaciones grandes",
    monthlyPrice: 9999,
    yearlyPrice: 99990,
    icon: Crown,
    features: [
      "Todo lo del plan Pro",
      "Participantes ilimitados",
      "Video 4K y múltiples cámaras",
      "Soporte 24/7 dedicado",
      "Comisión del 10%",
      "API personalizada",
      "Integración con sistemas existentes",
      "Gestor de cuenta dedicado",
    ],
    limitations: {
      maxAuctions: "unlimited",
      maxBidders: "unlimited",
      videoQuality: "4K",
      support: "24/7 Dedicado",
    },
  },
]

export default function PlansPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isYearly, setIsYearly] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price)
  }

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      router.push("/registro")
      return
    }
    router.push(`/planes/checkout?plan=${planId}&billing=${isYearly ? "yearly" : "monthly"}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Elige tu Plan</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Encuentra el plan perfecto para tus necesidades de subastas
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!isYearly ? "font-semibold" : "text-muted-foreground"}`}>Mensual</span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`text-sm ${isYearly ? "font-semibold" : "text-muted-foreground"}`}>
              Anual
              <Badge variant="secondary" className="ml-2">
                Ahorra 17%
              </Badge>
            </span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
            const isCurrentPlan = user?.plan === plan.id

            return (
              <Card
                key={plan.id}
                className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""} ${
                  isCurrentPlan ? "border-green-500" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Más Popular</Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <div className="text-4xl font-bold">{price === 0 ? "Gratis" : formatPrice(price)}</div>
                    {price > 0 && (
                      <div className="text-sm text-muted-foreground">{isYearly ? "por año" : "por mes"}</div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations */}
                  <div className="pt-4 border-t space-y-2">
                    <h4 className="font-semibold text-sm">Límites del Plan:</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>
                        Subastas:{" "}
                        {plan.limitations.maxAuctions === "unlimited" ? "Ilimitadas" : plan.limitations.maxAuctions}
                      </div>
                      <div>
                        Participantes:{" "}
                        {plan.limitations.maxBidders === "unlimited" ? "Ilimitados" : plan.limitations.maxBidders}
                      </div>
                      <div>Video: {plan.limitations.videoQuality}</div>
                      <div>Soporte: {plan.limitations.support}</div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    disabled={isCurrentPlan}
                  >
                    {isCurrentPlan ? "Plan Actual" : `Seleccionar ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">¿Tienes preguntas?</h2>
          <p className="text-muted-foreground mb-6">Nuestro equipo está aquí para ayudarte a elegir el plan perfecto</p>
          <Button variant="outline" onClick={() => router.push("/contacto")}>
            Contactar Ventas
          </Button>
        </div>
      </div>
    </div>
  )
}
