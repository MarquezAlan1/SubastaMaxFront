"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Gavel, Menu, User, Settings, LogOut, Wallet, Home, Grid3X3, BarChart3, Plus } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { cn } from "@/lib/utils"

export function Navigation() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navigation = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Catálogo", href: "/catalogo", icon: Grid3X3 },
    ...(user?.role === "subastador" ? [{ name: "Mis Subastas", href: "/subastador", icon: Gavel }] : []),
    ...(user?.role === "admin" ? [{ name: "Admin", href: "/admin", icon: BarChart3 }] : []),
  ]

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              mobile ? "w-full" : "",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
            onClick={() => mobile && setMobileOpen(false)}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
    </>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Gavel className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">SubastaMax</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavItems />
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Quick Actions for Auctioneers */}
                {user.role === "subastador" && (
                  <Link href="/subastador/crear">
                    <Button variant="ghost" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Nueva Subasta</span>
                    </Button>
                  </Link>
                )}

                {/* Notifications */}
                <NotificationsDropdown />

                {/* Wallet */}
                <Link href="/wallet">
                  <Button variant="ghost" size="sm">
                    <Wallet className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">$2,500</span>
                  </Button>
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="w-fit text-xs">
                            {user.role}
                          </Badge>
                          <Badge variant="outline" className="w-fit text-xs">
                            {user.plan}
                          </Badge>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/perfil/${user.id}`}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wallet">
                        <Wallet className="mr-2 h-4 w-4" />
                        <span>Wallet</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "subastador" && (
                      <DropdownMenuItem asChild>
                        <Link href="/subastador">
                          <Gavel className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configuración</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/registro">
                  <Button size="sm">Registrarse</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-4 mt-8">
                  <NavItems mobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
