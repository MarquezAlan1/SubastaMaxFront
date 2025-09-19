import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Gavel, Users, Shield, Zap, Globe, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gavel className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">SubastaMax</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/catalogo" className="text-muted-foreground hover:text-foreground transition-colors">
                Catálogo
              </Link>
              <Link href="/planes" className="text-muted-foreground hover:text-foreground transition-colors">
                Planes
              </Link>
              <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                Iniciar Sesión
              </Link>
              <Link href="/registro">
                <Button>Registrarse</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            Plataforma Nacional de Subastas
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Subastas en Tiempo Real
            <span className="text-primary block">a Escala Nacional</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Participa en subastas con miles de usuarios simultáneos. Video en vivo, pujas en tiempo real y la máxima
            seguridad para tus transacciones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalogo">
              <Button size="lg" className="w-full sm:w-auto">
                Ver Subastas Activas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/registro">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Comenzar Gratis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">¿Por qué elegir SubastaMax?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              La plataforma más avanzada para subastas profesionales con tecnología de última generación
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Tiempo Real</CardTitle>
                <CardDescription>
                  Pujas instantáneas con WebSockets y actualizaciones en vivo para miles de participantes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Escala Masiva</CardTitle>
                <CardDescription>
                  Soporta miles de usuarios simultáneos con infraestructura de alta disponibilidad
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Máxima Seguridad</CardTitle>
                <CardDescription>
                  Sistema de reputación, verificación de usuarios y transacciones seguras
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Multi-tenant</CardTitle>
                <CardDescription>
                  Plataforma SaaS con soporte para múltiples organizaciones y branding personalizado
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Analytics Avanzados</CardTitle>
                <CardDescription>Dashboard completo con métricas en tiempo real y reportes detallados</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Gavel className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Herramientas Pro</CardTitle>
                <CardDescription>
                  Suite completa para subastadores con gestión de lotes, streaming y más
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h2>
          <p className="text-xl mb-8 opacity-90">Únete a miles de usuarios que ya confían en SubastaMax</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registro">
              <Button variant="secondary" size="lg">
                Crear Cuenta Gratis
              </Button>
            </Link>
            <Link href="/catalogo">
              <Button
                variant="outline"
                size="lg"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              >
                Explorar Subastas
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Gavel className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">SubastaMax</span>
              </div>
              <p className="text-muted-foreground">La plataforma líder en subastas online a escala nacional.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Plataforma</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/catalogo" className="hover:text-foreground">
                    Catálogo
                  </Link>
                </li>
                <li>
                  <Link href="/planes" className="hover:text-foreground">
                    Planes
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-foreground">
                    Admin
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Centro de Ayuda
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Términos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 SubastaMax. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
