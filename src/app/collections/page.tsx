"use client"

import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { SlidersHorizontal, X, Loader2 } from "lucide-react"

import { useTranslation } from "@/lib/i18n/context"
import type { Watch } from "@/lib/types"
import { WatchCard } from "@/components/watches/watch-card"
import { FilterSidebar } from "@/components/collections/filter-sidebar"
import { SortDropdown } from "@/components/collections/sort-dropdown"
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
  if (filters.brands.length > 0) params.set("brand", filters.brands.join(","))
  if (filters.categories.length > 0) params.set("category", filters.categories.join(","))
  if (filters.conditions.length > 0) params.set("condition", filters.conditions.join(","))
  if (filters.minPrice > DEFAULT_MIN_PRICE) params.set("minPrice", String(filters.minPrice))
  if (filters.maxPrice < DEFAULT_MAX_PRICE) params.set("maxPrice", String(filters.maxPrice))
  if (sort && sort !== "featured") params.set("sort", sort)
  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

function CollectionsContent() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [watches, setWatches] = useState<Watch[]>([])
  const [loadingWatches, setLoadingWatches] = useState(true)

  useEffect(() => {
    fetch("/api/watches")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setWatches(data)
      })
      .catch(() => {})
      .finally(() => setLoadingWatches(false))
  }, [])

  const filters = useMemo(() => parseFiltersFromParams(searchParams), [searchParams])
  const sort = searchParams.get("sort") ?? "featured"

  const updateURL = useCallback(
    (newFilters: FilterState, newSort: string) => {
      const qs = buildSearchParams(newFilters, newSort)
      router.push(`/collections${qs}`, { scroll: false })
    },
    [router]
  )

  const handleFilterChange = useCallback(
    (newFilters: FilterState) => updateURL(newFilters, sort),
    [updateURL, sort]
  )

  const handleSortChange = useCallback(
    (newSort: string) => updateURL(filters, newSort),
    [updateURL, filters]
  )

  const clearAll = useCallback(() => updateURL(getDefaultFilters(), "featured"), [updateURL])

  const filteredWatches = useMemo(
    () => sortWatches(filterWatches(watches, filters), sort),
    [watches, filters, sort]
  )

  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.categories.length > 0 ||
    filters.conditions.length > 0 ||
    filters.minPrice > DEFAULT_MIN_PRICE ||
    filters.maxPrice < DEFAULT_MAX_PRICE

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h3 className="font-mono text-primary text-xs tracking-[0.2em] mb-2 uppercase">{t("collections.theCollection")}</h3>
        <h1 className="font-serif italic text-3xl md:text-4xl text-foreground">{t("collections.allWatches")}</h1>
        <p className="font-mono text-xs text-foreground/40 mt-2">
          {filteredWatches.length} {t("collections.results")}
        </p>
      </div>

      {/* Sort bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {/* Mobile filter trigger */}
          <button
            onClick={() => {
              const sidebar = document.getElementById("mobile-filters")
              if (sidebar) sidebar.classList.toggle("hidden")
            }}
            className="lg:hidden flex items-center gap-2 bg-card text-foreground text-sm px-4 py-2 hover:border-primary/40 transition-colors"
            style={{ borderRadius: 'var(--card-radius)', boxShadow: 'var(--soft-shadow)' }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t("collections.filters")}
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-primary hover:text-foreground transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" /> {t("filters.clearAll")}
            </button>
          )}
        </div>
        <SortDropdown value={sort} onChange={handleSortChange} />
      </div>

      {/* Mobile filter sidebar (hidden by default) */}
      <div id="mobile-filters" className="hidden lg:hidden mb-6 bg-card p-6" style={{ borderRadius: 'var(--card-radius)', boxShadow: 'var(--soft-shadow)' }}>
        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {/* Main content: sidebar + grid */}
      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block shrink-0">
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
        </aside>

        {/* Watch grid */}
        <div className="flex-1 min-w-0">
          {filteredWatches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredWatches.map((watch) => (
                <WatchCard key={watch.id} watch={watch} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-foreground/40 text-lg font-sans">{t("collections.noMatch")}</p>
              <button onClick={clearAll} className="text-primary text-sm mt-3 hover:underline">
                {t("collections.clearAllFilters")}
              </button>
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
            <div className="h-4 w-32 bg-border animate-pulse rounded mb-3" />
            <div className="h-10 w-64 bg-border animate-pulse rounded" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square bg-card animate-pulse rounded-2xl" />
                <div className="h-3 w-20 bg-border animate-pulse rounded" />
                <div className="h-4 w-40 bg-border animate-pulse rounded" />
                <div className="h-5 w-24 bg-border animate-pulse rounded" />
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
