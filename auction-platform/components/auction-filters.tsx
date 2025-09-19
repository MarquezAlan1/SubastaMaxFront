"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"

interface FilterState {
  search: string
  category: string
  status: string
  priceRange: string
  sortBy: string
}

interface AuctionFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  totalResults: number
}

const CATEGORIES = [
  { value: "", label: "Todas las categorías" },
  { value: "arte", label: "Arte y Antigüedades" },
  { value: "vehiculos", label: "Vehículos" },
  { value: "joyeria", label: "Joyería y Relojes" },
  { value: "electronica", label: "Electrónicos" },
  { value: "inmuebles", label: "Inmuebles" },
  { value: "coleccionables", label: "Coleccionables" },
  { value: "otros", label: "Otros" },
]

const STATUS_OPTIONS = [
  { value: "", label: "Todos los estados" },
  { value: "live", label: "En vivo" },
  { value: "upcoming", label: "Próximas" },
  { value: "ended", label: "Finalizadas" },
]

const PRICE_RANGES = [
  { value: "", label: "Cualquier precio" },
  { value: "0-1000", label: "Hasta $1,000" },
  { value: "1000-5000", label: "$1,000 - $5,000" },
  { value: "5000-10000", label: "$5,000 - $10,000" },
  { value: "10000-50000", label: "$10,000 - $50,000" },
  { value: "50000+", label: "Más de $50,000" },
]

const SORT_OPTIONS = [
  { value: "ending_soon", label: "Terminan pronto" },
  { value: "newest", label: "Más recientes" },
  { value: "price_low", label: "Precio: menor a mayor" },
  { value: "price_high", label: "Precio: mayor a menor" },
  { value: "most_bids", label: "Más pujas" },
  { value: "most_popular", label: "Más populares" },
]

export function AuctionFilters({ onFiltersChange, totalResults }: AuctionFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "",
    status: "",
    priceRange: "",
    sortBy: "ending_soon",
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFiltersChange(updated)
  }

  const clearFilters = () => {
    const cleared = {
      search: "",
      category: "",
      status: "",
      priceRange: "",
      sortBy: "ending_soon",
    }
    setFilters(cleared)
    onFiltersChange(cleared)
  }

  const hasActiveFilters = filters.search || filters.category || filters.status || filters.priceRange

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar subastas, productos, subastadores..."
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="pl-10"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filters.status === "live" ? "default" : "outline"}
          size="sm"
          onClick={() => updateFilters({ status: filters.status === "live" ? "" : "live" })}
        >
          En Vivo
        </Button>
        <Button
          variant={filters.status === "upcoming" ? "default" : "outline"}
          size="sm"
          onClick={() => updateFilters({ status: filters.status === "upcoming" ? "" : "upcoming" })}
        >
          Próximas
        </Button>
        <Button variant="outline" size="sm" onClick={() => setShowAdvanced(!showAdvanced)} className="ml-auto">
          <Filter className="mr-2 h-4 w-4" />
          Filtros Avanzados
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros Avanzados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select value={filters.category} onValueChange={(value) => updateFilters({ category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={filters.status} onValueChange={(value) => updateFilters({ status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Rango de Precio</Label>
                <Select value={filters.priceRange} onValueChange={(value) => updateFilters({ priceRange: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRICE_RANGES.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {totalResults} {totalResults === 1 ? "subasta encontrada" : "subastas encontradas"}
          </p>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" />
              Limpiar filtros
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="sort" className="text-sm">
            Ordenar por:
          </Label>
          <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Búsqueda: "{filters.search}"
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilters({ search: "" })} />
            </Badge>
          )}
          {filters.category && (
            <Badge variant="secondary" className="gap-1">
              {CATEGORIES.find((c) => c.value === filters.category)?.label}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilters({ category: "" })} />
            </Badge>
          )}
          {filters.status && (
            <Badge variant="secondary" className="gap-1">
              {STATUS_OPTIONS.find((s) => s.value === filters.status)?.label}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilters({ status: "" })} />
            </Badge>
          )}
          {filters.priceRange && (
            <Badge variant="secondary" className="gap-1">
              {PRICE_RANGES.find((p) => p.value === filters.priceRange)?.label}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilters({ priceRange: "" })} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
