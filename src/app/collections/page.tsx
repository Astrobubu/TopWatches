"use client"

import { Suspense, useCallback, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { SlidersHorizontal } from "lucide-react"

import { watches } from "@/data/watches"
import { WatchCard } from "@/components/watches/watch-card"
import { FilterSidebar } from "@/components/collections/filter-sidebar"
import { SortDropdown } from "@/components/collections/sort-dropdown"
import { ActiveFilters } from "@/components/collections/active-filters"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  type FilterState,
  DEFAULT_MIN_PRICE,
  DEFAULT_MAX_PRICE,
  filterWatches,
  sortWatches,
  getDefaultFilters,
} from "@/lib/filters"

function parseFiltersFromParams(params: URLSearchParams): FilterState {
  const brands = params.get("brand")?.split(",").filter(Boolean) ?? []
  const categories = params.get("category")?.split(",").filter(Boolean) ?? []
  const conditions = params.get("condition")?.split(",").filter(Boolean) ?? []
  const minPrice = params.get("minPrice")
    ? parseInt(params.get("minPrice")!, 10)
    : DEFAULT_MIN_PRICE
  const maxPrice = params.get("maxPrice")
    ? parseInt(params.get("maxPrice")!, 10)
    : DEFAULT_MAX_PRICE

  return {
    brands,
    categories,
    conditions,
    minPrice: isNaN(minPrice) ? DEFAULT_MIN_PRICE : minPrice,
    maxPrice: isNaN(maxPrice) ? DEFAULT_MAX_PRICE : maxPrice,
  }
}

function buildSearchParams(filters: FilterState, sort: string): string {
  const params = new URLSearchParams()

  if (filters.brands.length > 0) {
    params.set("brand", filters.brands.join(","))
  }
  if (filters.categories.length > 0) {
    params.set("category", filters.categories.join(","))
  }
  if (filters.conditions.length > 0) {
    params.set("condition", filters.conditions.join(","))
  }
  if (filters.minPrice > DEFAULT_MIN_PRICE) {
    params.set("minPrice", String(filters.minPrice))
  }
  if (filters.maxPrice < DEFAULT_MAX_PRICE) {
    params.set("maxPrice", String(filters.maxPrice))
  }
  if (sort && sort !== "featured") {
    params.set("sort", sort)
  }

  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

function CollectionsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const filters = useMemo(
    () => parseFiltersFromParams(searchParams),
    [searchParams]
  )
  const sort = searchParams.get("sort") ?? "featured"

  const updateURL = useCallback(
    (newFilters: FilterState, newSort: string) => {
      const qs = buildSearchParams(newFilters, newSort)
      router.push(`/collections${qs}`, { scroll: false })
    },
    [router]
  )

  const handleFilterChange = useCallback(
    (newFilters: FilterState) => {
      updateURL(newFilters, sort)
    },
    [updateURL, sort]
  )

  const handleSortChange = useCallback(
    (newSort: string) => {
      updateURL(filters, newSort)
    },
    [updateURL, filters]
  )

  const clearAll = useCallback(() => {
    updateURL(getDefaultFilters(), "featured")
  }, [updateURL])

  const handleRemoveFilter = useCallback(
    (key: string, value: string) => {
      if (key === "minPrice") {
        updateURL({ ...filters, minPrice: DEFAULT_MIN_PRICE }, sort)
      } else if (key === "maxPrice") {
        updateURL({ ...filters, maxPrice: DEFAULT_MAX_PRICE }, sort)
      } else {
        const arrayKey = key as "brands" | "categories" | "conditions"
        updateURL(
          {
            ...filters,
            [arrayKey]: filters[arrayKey].filter((v) => v !== value),
          },
          sort
        )
      }
    },
    [updateURL, filters, sort]
  )

  const filteredWatches = useMemo(
    () => sortWatches(filterWatches(watches, filters), sort),
    [filters, sort]
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold">Our Collection</h1>
        <p className="text-muted-foreground mt-2">
          Browse our curated selection of luxury timepieces
        </p>
      </div>

      {/* Active filters + Sort bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {/* Mobile filter trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <SlidersHorizontal className="size-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-6">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </SheetContent>
          </Sheet>
          <span className="text-sm text-muted-foreground">
            {filteredWatches.length}{" "}
            {filteredWatches.length === 1 ? "watch" : "watches"}
          </span>
        </div>
        <SortDropdown value={sort} onChange={handleSortChange} />
      </div>

      {/* Active filter badges */}
      <ActiveFilters
        filters={filters}
        onRemove={handleRemoveFilter}
        onClearAll={clearAll}
      />

      {/* Main content: sidebar + grid */}
      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block shrink-0">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </aside>

        {/* Watch grid */}
        <div className="flex-1 min-w-0">
          {filteredWatches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWatches.map((watch) => (
                <WatchCard key={watch.id} watch={watch} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No watches match your filters
              </p>
              <Button variant="link" onClick={clearAll} className="mt-2">
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CollectionsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-10 w-64 bg-muted animate-pulse rounded" />
            <div className="h-5 w-96 bg-muted animate-pulse rounded mt-2" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[4/5] bg-muted animate-pulse rounded" />
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-5 w-40 bg-muted animate-pulse rounded" />
                <div className="h-5 w-20 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      }
    >
      <CollectionsContent />
    </Suspense>
  )
}
