"use client"

import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  type FilterState,
  DEFAULT_MIN_PRICE,
  DEFAULT_MAX_PRICE,
  getLabelForFilterValue,
} from "@/lib/filters"

interface ActiveFiltersProps {
  filters: FilterState
  onRemove: (key: string, value: string) => void
  onClearAll: () => void
}

export function ActiveFilters({
  filters,
  onRemove,
  onClearAll,
}: ActiveFiltersProps) {
  const tags: { key: string; value: string; label: string }[] = []

  for (const brand of filters.brands) {
    tags.push({
      key: "brands",
      value: brand,
      label: getLabelForFilterValue("brands", brand),
    })
  }
  for (const category of filters.categories) {
    tags.push({
      key: "categories",
      value: category,
      label: getLabelForFilterValue("categories", category),
    })
  }
  for (const condition of filters.conditions) {
    tags.push({
      key: "conditions",
      value: condition,
      label: getLabelForFilterValue("conditions", condition),
    })
  }
  for (const gender of filters.genders) {
    tags.push({
      key: "genders",
      value: gender,
      label: getLabelForFilterValue("genders", gender),
    })
  }
  for (const size of filters.caseSizes) {
    tags.push({
      key: "caseSizes",
      value: size,
      label: getLabelForFilterValue("caseSizes", size),
    })
  }
  if (filters.minPrice > DEFAULT_MIN_PRICE) {
    tags.push({
      key: "minPrice",
      value: String(filters.minPrice),
      label: `Min: $${filters.minPrice.toLocaleString()}`,
    })
  }
  if (filters.maxPrice < DEFAULT_MAX_PRICE) {
    tags.push({
      key: "maxPrice",
      value: String(filters.maxPrice),
      label: `Max: $${filters.maxPrice.toLocaleString()}`,
    })
  }

  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {tags.map((tag) => (
        <Badge
          key={`${tag.key}-${tag.value}`}
          variant="secondary"
          className="gap-1 pr-1 text-xs"
        >
          {tag.label}
          <button
            type="button"
            onClick={() => onRemove(tag.key, tag.value)}
            className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
          >
            <X className="size-3" />
            <span className="sr-only">Remove {tag.label} filter</span>
          </button>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="text-xs text-muted-foreground h-auto py-1 px-2"
      >
        Clear All
      </Button>
    </div>
  )
}
