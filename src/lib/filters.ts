import type { Watch } from "@/lib/types"

export interface FilterState {
  brands: string[]
  categories: string[]
  conditions: string[]
  genders: string[]
  caseSizes: string[]
  minPrice: number
  maxPrice: number
}

export const DEFAULT_MIN_PRICE = 0
export const DEFAULT_MAX_PRICE = 200000

export const BRAND_OPTIONS = [
  { value: "rolex", label: "Rolex" },
  { value: "patek-philippe", label: "Patek Philippe" },
  { value: "audemars-piguet", label: "Audemars Piguet" },
  { value: "omega", label: "Omega" },
  { value: "cartier", label: "Cartier" },
  { value: "tag-heuer", label: "TAG Heuer" },
  { value: "iwc", label: "IWC" },
]

export const CATEGORY_OPTIONS = [
  { value: "dress", label: "Dress" },
  { value: "sport", label: "Sport" },
  { value: "dive", label: "Dive" },
  { value: "chronograph", label: "Chronograph" },
  { value: "pilot", label: "Pilot" },
]

export const CONDITION_OPTIONS = [
  { value: "unworn", label: "Unworn" },
  { value: "preowned", label: "Pre-Owned" },
  { value: "unwanted-gift", label: "Unwanted Gift" },
]

export const GENDER_OPTIONS = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "unisex", label: "Unisex" },
]

export const CASE_SIZE_OPTIONS = [
  { value: "26", label: "26mm" },
  { value: "28", label: "28mm" },
  { value: "31", label: "31mm" },
  { value: "36", label: "36mm" },
  { value: "40", label: "40mm" },
  { value: "41", label: "41mm" },
  { value: "42", label: "42mm" },
  { value: "43", label: "43mm" },
  { value: "44", label: "44mm" },
  { value: "45", label: "45mm" },
]

export function getDefaultFilters(): FilterState {
  return {
    brands: [],
    categories: [],
    conditions: [],
    genders: [],
    caseSizes: [],
    minPrice: DEFAULT_MIN_PRICE,
    maxPrice: DEFAULT_MAX_PRICE,
  }
}

function extractMM(caseSize: string | undefined): number | null {
  if (!caseSize) return null
  const match = caseSize.match(/(\d+(?:\.\d+)?)\s*mm/i)
  return match ? Math.round(parseFloat(match[1])) : null
}

export function brandSlug(brand: string): string {
  return brand.toLowerCase().replace(/\s+/g, "-")
}

export function filterWatches(watches: Watch[], filters: FilterState): Watch[] {
  return watches.filter((w) => {
    if (
      filters.brands.length > 0 &&
      !filters.brands.includes(brandSlug(w.brand))
    ) {
      return false
    }
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(w.category)
    ) {
      return false
    }
    if (
      filters.conditions.length > 0 &&
      !filters.conditions.includes(w.condition)
    ) {
      return false
    }
    if (
      filters.genders.length > 0 &&
      (!w.gender || !filters.genders.includes(w.gender))
    ) {
      return false
    }
    if (filters.caseSizes.length > 0) {
      const mm = extractMM(w.specs?.caseSize)
      if (!mm || !filters.caseSizes.includes(String(mm))) {
        return false
      }
    }
    if (filters.minPrice > DEFAULT_MIN_PRICE && w.price < filters.minPrice) {
      return false
    }
    if (filters.maxPrice < DEFAULT_MAX_PRICE && w.price > filters.maxPrice) {
      return false
    }
    return true
  })
}

export function sortWatches(watches: Watch[], sort: string): Watch[] {
  switch (sort) {
    case "price-asc":
      return [...watches].sort((a, b) => a.price - b.price)
    case "price-desc":
      return [...watches].sort((a, b) => b.price - a.price)
    case "brand":
      return [...watches].sort((a, b) => a.brand.localeCompare(b.brand))
    case "newest":
      return [...watches].sort((a, b) => b.specs.year - a.specs.year)
    default:
      return [
        ...watches.filter((w) => w.featured),
        ...watches.filter((w) => !w.featured),
      ]
  }
}

export function getLabelForFilterValue(
  key: "brands" | "categories" | "conditions" | "genders" | "caseSizes",
  value: string
): string {
  const options =
    key === "brands"
      ? BRAND_OPTIONS
      : key === "categories"
        ? CATEGORY_OPTIONS
        : key === "genders"
          ? GENDER_OPTIONS
          : key === "caseSizes"
            ? CASE_SIZE_OPTIONS
            : CONDITION_OPTIONS
  return options.find((o) => o.value === value)?.label ?? value
}
