"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TrendingUp, Crown, Trophy } from "lucide-react"
import type { Bid } from "@/lib/store"

interface BidHistoryProps {
  auctionId: string
  className?: string
}

export function BidHistory({ auctionId, className }: BidHistoryProps) {
  const [bids, setBids] = useState<Bid[]>([])

  useEffect(() => {
    // Simulate initial bid history
    const mockBids: Bid[] = [
      {
        id: "1",
        auctionId,
        userId: "user1",
        userName: "Carlos M.",
        amount: 15000,
        timestamp: new Date(Date.now() - 300000),
        status: "accepted",
      },
      {
        id: "2",
        auctionId,
        userId: "user2",
        userName: "Ana L.",
        amount: 14500,
        timestamp: new Date(Date.now() - 600000),
        status: "accepted",
      },
      {
        id: "3",
        auctionId,
        userId: "user3",
        userName: "Roberto S.",
        amount: 14000,
        timestamp: new Date(Date.now() - 900000),
        status: "accepted",
      },
      {
        id: "4",
        auctionId,
        userId: "user4",
        userName: "María G.",
        amount: 13500,
        timestamp: new Date(Date.now() - 1200000),
        status: "accepted",
      },
      {
        id: "5",
        auctionId,
        userId: "user5",
        userName: "Luis P.",
        amount: 13000,
        timestamp: new Date(Date.now() - 1500000),
        status: "accepted",
      },
    ]

    setBids(mockBids)

    // Simulate new bids coming in
    const bidInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        const mockUsers = ["Carlos M.", "Ana L.", "Roberto S.", "María G.", "Luis P.", "Elena R.", "Diego F."]
        const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)]
        const lastBid = bids[0]
        const newAmount = lastBid ? lastBid.amount + 500 + Math.floor(Math.random() * 1000) : 15000

        const newBid: Bid = {
          id: Date.now().toString(),
          auctionId,
          userId: `user-${Math.random()}`,
          userName: randomUser,
          amount: newAmount,
          timestamp: new Date(),
          status: "accepted",
        }

        setBids((prev) => [newBid, ...prev.slice(0, 19)]) // Keep last 20 bids
      }
    }, 8000)

    return () => clearInterval(bidInterval)
  }, [auctionId])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price)
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return "Ahora"
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`
    const days = Math.floor(hours / 24)
    return `${days}d`
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Historial de Pujas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80">
          <div className="space-y-1 px-4 pb-4">
            {bids.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No hay pujas aún</p>
                <p className="text-sm">¡Sé el primero en pujar!</p>
              </div>
            ) : (
              bids.map((bid, index) => (
                <div
                  key={bid.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    index === 0 ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/placeholder-icon.png?height=32&width=32&text=${bid.userName[0]}`} />
                      <AvatarFallback className="text-xs">{bid.userName[0]}</AvatarFallback>
                    </Avatar>
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1">
                        <Crown className="h-4 w-4 text-yellow-500" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{bid.userName}</span>
                      {index === 0 && (
                        <Badge variant="secondary" className="text-xs">
                          <Trophy className="h-3 w-3 mr-1" />
                          Líder
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">{formatPrice(bid.amount)}</span>
                      <span className="text-xs text-muted-foreground">{formatTime(bid.timestamp)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <Badge
                      variant={
                        bid.status === "accepted" ? "default" : bid.status === "pending" ? "secondary" : "destructive"
                      }
                      className="text-xs"
                    >
                      {bid.status === "accepted" ? "✓" : bid.status === "pending" ? "..." : "✗"}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
