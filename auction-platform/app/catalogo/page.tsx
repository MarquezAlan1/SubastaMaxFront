"use client"

import { useState, useEffect } from "react"
import { AuctionCard } from "@/components/auction-card"
import { AuctionFilters } from "@/components/auction-filters"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Gavel, RefreshCw } from "lucide-react"
import { AuctionAPI } from "@/lib/api"
import { useAuctionStore, type Auction } from "@/lib/store"
import Link from "next/link"

interface FilterState {
  search: string
  category: string
  status: string
  priceRange: string
  sortBy: string
}

export default function CatalogPage() {
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { setAuctions: setStoreAuctions } = useAuctionStore()

  useEffect(() => {
    loadAuctions()
  }, [])

  const loadAuctions = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await AuctionAPI.getAuctions()
      setAuctions(data)
      setFilteredAuctions(data)
      setStoreAuctions(data)
    } catch (err) {
      setError("Error al cargar las subastas. Por favor, intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const handleFiltersChange = (filters: FilterState) => {
    let filtered = [...auctions]

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(
        (auction) =>
          auction.title.toLowerCase().includes(searchTerm) ||
          auction.description.toLowerCase().includes(searchTerm) ||
          auction.auctioneerName.toLowerCase().includes(searchTerm),
      )
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter((auction) => auction.category === filters.category)
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter((auction) => auction.status === filters.status)
    }

    // Apply price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number)
      filtered = filtered.filter((auction) => {
        const price = auction.status === "upcoming" ? auction.startingBid : auction.currentBid
        if (filters.priceRange === "50000+") {
          return price >= 50000
        }
        return price >= min && price <= max
      })
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "ending_soon":
        filtered.sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime())
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
        break
      case "price_low":
        filtered.sort((a, b) => {
          const priceA = a.status === "upcoming" ? a.startingBid : a.currentBid
          const priceB = b.status === "upcoming" ? b.startingBid : b.currentBid
          return priceA - priceB
        })
        break
      case "price_high":
        filtered.sort((a, b) => {
          const priceA = a.status === "upcoming" ? a.startingBid : a.currentBid
          const priceB = b.status === "upcoming" ? b.startingBid : b.currentBid
          return priceB - priceA
        })
        break
      case "most_bids":
        filtered.sort((a, b) => b.bidCount - a.bidCount)
        break
      case "most_popular":
        filtered.sort((a, b) => b.participants - a.participants)
        break
    }

    // Prioritize featured auctions
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return 0
    })

    setFilteredAuctions(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-8">
            <Gavel className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Catálogo de Subastas</h1>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-32 ml-auto" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-video w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Gavel className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Catálogo de Subastas</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadAuctions} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
            <Link href="/login">
              <Button>Iniciar Sesión</Button>
            </Link>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <div className="mb-8">
          <AuctionFilters onFiltersChange={handleFiltersChange} totalResults={filteredAuctions.length} />
        </div>

        {/* Auctions Grid */}
        {filteredAuctions.length === 0 ? (
          <div className="text-center py-12">
            <Gavel className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No se encontraron subastas</h3>
            <p className="text-muted-foreground mb-4">Intenta ajustar los filtros o buscar con términos diferentes</p>
            <Button
              variant="outline"
              onClick={() =>
                handleFiltersChange({
                  search: "",
                  category: "",
                  status: "",
                  priceRange: "",
                  sortBy: "ending_soon",
                })
              }
            >
              Limpiar filtros
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredAuctions.length > 0 && filteredAuctions.length >= 12 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Cargar más subastas
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
