// Mock API layer for auction platform
import type { Auction, Bid } from "./store"

// Simulated exchange rates
const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.85,
  MXN: 17.5,
  ARS: 350,
}

export class AuctionAPI {
  static async getAuctions(filters?: {
    category?: string
    status?: string
    search?: string
  }): Promise<Auction[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const mockAuctions: Auction[] = [
      {
        id: "1",
        title: "Arte Contemporáneo - Colección Privada",
        description: "Subasta exclusiva de arte contemporáneo con obras de artistas reconocidos",
        category: "arte",
        status: "live",
        startTime: new Date(Date.now() - 3600000),
        endTime: new Date(Date.now() + 3600000),
        currentBid: 15000,
        startingBid: 5000,
        increment: 500,
        bidCount: 23,
        participants: 156,
        auctioneerId: "2",
        auctioneerName: "Juan Subastador",
        imageUrl: "/contemporary-art-auction.jpg",
        videoUrl: "https://example.com/live-stream-1",
        autoExtend: true,
        tenantId: "main",
        featured: true,
      },
      {
        id: "2",
        title: "Vehículos Clásicos Premium",
        description: "Colección de automóviles clásicos en excelente estado",
        category: "vehiculos",
        status: "upcoming",
        startTime: new Date(Date.now() + 7200000),
        endTime: new Date(Date.now() + 14400000),
        currentBid: 0,
        startingBid: 25000,
        increment: 1000,
        bidCount: 0,
        participants: 89,
        auctioneerId: "2",
        auctioneerName: "Juan Subastador",
        imageUrl: "/placeholder-vxpkz.png",
        autoExtend: true,
        tenantId: "main",
        featured: false,
      },
      {
        id: "3",
        title: "Joyería y Relojes de Lujo",
        description: "Piezas únicas de joyería y relojes de marcas prestigiosas",
        category: "joyeria",
        status: "ended",
        startTime: new Date(Date.now() - 86400000),
        endTime: new Date(Date.now() - 82800000),
        currentBid: 8500,
        startingBid: 2000,
        increment: 250,
        bidCount: 45,
        participants: 234,
        auctioneerId: "2",
        auctioneerName: "Juan Subastador",
        imageUrl: "/placeholder-vcuj7.png",
        autoExtend: false,
        tenantId: "main",
        featured: false,
      },
    ]

    let filtered = mockAuctions

    if (filters?.category) {
      filtered = filtered.filter((a) => a.category === filters.category)
    }
    if (filters?.status) {
      filtered = filtered.filter((a) => a.status === filters.status)
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(
        (a) => a.title.toLowerCase().includes(search) || a.description.toLowerCase().includes(search),
      )
    }

    return filtered
  }

  static async getAuction(id: string): Promise<Auction | null> {
    const auctions = await this.getAuctions()
    return auctions.find((a) => a.id === id) || null
  }

  static async placeBid(
    auctionId: string,
    amount: number,
    userId: string,
  ): Promise<{
    success: boolean
    bid?: Bid
    error?: string
  }> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const auction = await this.getAuction(auctionId)
    if (!auction) {
      return { success: false, error: "Subasta no encontrada" }
    }

    if (auction.status !== "live") {
      return { success: false, error: "La subasta no está activa" }
    }

    if (amount <= auction.currentBid) {
      return { success: false, error: "La puja debe ser mayor al precio actual" }
    }

    const bid: Bid = {
      id: Date.now().toString(),
      auctionId,
      userId,
      userName: "Usuario Demo",
      amount,
      timestamp: new Date(),
      status: "accepted",
    }

    return { success: true, bid }
  }

  static async getExchangeRate(from: string, to: string): Promise<number> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const fromRate = EXCHANGE_RATES[from as keyof typeof EXCHANGE_RATES] || 1
    const toRate = EXCHANGE_RATES[to as keyof typeof EXCHANGE_RATES] || 1
    return toRate / fromRate
  }

  static simulateWebSocket(auctionId: string, callback: (data: any) => void) {
    const interval = setInterval(() => {
      // Simulate random bid updates
      if (Math.random() > 0.7) {
        callback({
          type: "bid_update",
          auctionId,
          bid: {
            id: Date.now().toString(),
            amount: Math.floor(Math.random() * 5000) + 10000,
            userName: `Usuario${Math.floor(Math.random() * 100)}`,
            timestamp: new Date(),
          },
        })
      }

      // Simulate participant count updates
      if (Math.random() > 0.8) {
        callback({
          type: "participants_update",
          auctionId,
          count: Math.floor(Math.random() * 50) + 100,
        })
      }
    }, 2000)

    return () => clearInterval(interval)
  }
}
