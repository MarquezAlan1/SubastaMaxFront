"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Users, Gavel, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Auction } from "@/lib/store"

interface AuctionCardProps {
  auction: Auction
}

export function AuctionCard({ auction }: AuctionCardProps) {
  const getStatusBadge = () => {
    switch (auction.status) {
      case "live":
        return (
          <Badge variant="destructive" className="animate-pulse">
            <div className="w-2 h-2 bg-current rounded-full mr-1" />
            EN VIVO
          </Badge>
        )
      case "upcoming":
        return <Badge variant="secondary">PRÓXIMA</Badge>
      case "ended":
        return <Badge variant="outline">FINALIZADA</Badge>
      default:
        return null
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price)
  }

  const formatTimeRemaining = () => {
    const now = new Date()
    const end = new Date(auction.endTime)
    const diff = end.getTime() - now.getTime()

    if (diff <= 0) return "Finalizada"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days}d ${hours % 24}h`
    }

    return `${hours}h ${minutes}m`
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={auction.imageUrl || "/placeholder.svg"}
            alt={auction.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {auction.featured && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-accent text-accent-foreground">DESTACADA</Badge>
            </div>
          )}
          <div className="absolute top-2 right-2">{getStatusBadge()}</div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {auction.title}
          </h3>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-2">{auction.description}</p>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Price Info */}
          <div className="space-y-1">
            {auction.status === "upcoming" ? (
              <div>
                <p className="text-sm text-muted-foreground">Precio inicial</p>
                <p className="text-xl font-bold text-primary">{formatPrice(auction.startingBid)}</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground">Puja actual</p>
                <p className="text-xl font-bold text-primary">{formatPrice(auction.currentBid)}</p>
                <p className="text-xs text-muted-foreground">{auction.bidCount} pujas</p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatTimeRemaining()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{auction.participants}</span>
            </div>
          </div>

          {/* Auctioneer */}
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={`/placeholder-icon.png?height=24&width=24&text=${auction.auctioneerName[0]}`} />
              <AvatarFallback className="text-xs">{auction.auctioneerName[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{auction.auctioneerName}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Link href={`/subasta/${auction.id}`} className="flex-1">
              <Button className="w-full" variant={auction.status === "live" ? "default" : "outline"}>
                {auction.status === "live" ? (
                  <>
                    <Gavel className="mr-2 h-4 w-4" />
                    Pujar Ahora
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Detalles
                  </>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
