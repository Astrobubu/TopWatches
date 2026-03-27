"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  type FilterState,
  BRAND_OPTIONS,
  CATEGORY_OPTIONS,
  CONDITION_OPTIONS,
  GENDER_OPTIONS,
  CASE_SIZE_OPTIONS,
  DEFAULT_MIN_PRICE,
  DEFAULT_MAX_PRICE,
} from "@/lib/filters"
import { useTranslation } from "@/lib/i18n/context"

interface FilterSidebarProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-2 text-sm font-semibold uppercase tracking-wider"
      >
        {title}
        <ChevronDown
          className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="pb-2 pt-1">{children}</div>}
    </div>
  )
}

function CheckboxFilter({
  options,
  selected,
  onToggle,
}: {
  options: { value: string; label: string }[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <div className="space-y-2.5">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-center gap-2.5 text-sm"
        >
          <Checkbox
            checked={selected.includes(option.value)}
            onCheckedChange={() => onToggle(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  )
}

export function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  const { t } = useTranslation()

  const categoryOptions = CATEGORY_OPTIONS.map(o => ({ ...o, label: t(`categories.${o.value}`) }))
  const conditionOptions = CONDITION_OPTIONS.map(o => ({ ...o, label: t(`conditions.${o.value}`) }))
  const genderOptions = GENDER_OPTIONS.map(o => ({ ...o, label: t(`genders.${o.value}`) }))

  function toggleArrayFilter(
    key: "brands" | "categories" | "conditions" | "genders" | "caseSizes",
    value: string
  ) {
    const current = filters[key]
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onFilterChange({ ...filters, [key]: next })
  }

  function handleMinPriceChange(val: string) {
    const num = val === "" ? DEFAULT_MIN_PRICE : parseInt(val, 10)
    if (!isNaN(num)) {
      onFilterChange({ ...filters, minPrice: num })
    }
  }

  function handleMaxPriceChange(val: string) {
    const num = val === "" ? DEFAULT_MAX_PRICE : parseInt(val, 10)
    if (!isNaN(num)) {
      onFilterChange({ ...filters, maxPrice: num })
    }
  }

  function clearAll() {
    onFilterChange({
      brands: [],
      categories: [],
      conditions: [],
      genders: [],
      caseSizes: [],
      minPrice: DEFAULT_MIN_PRICE,
      maxPrice: DEFAULT_MAX_PRICE,
    })
  }

  const hasFilters =
    filters.brands.length > 0 ||
    filters.categories.length > 0 ||
    filters.conditions.length > 0 ||
    filters.genders.length > 0 ||
    filters.caseSizes.length > 0 ||
    filters.minPrice > DEFAULT_MIN_PRICE ||
    filters.maxPrice < DEFAULT_MAX_PRICE

  return (
    <div className="w-full lg:w-72 space-y-1">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">{t("filters.title")}</h2>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-xs text-muted-foreground"
          >
            {t("filters.clearAll")}
          </Button>
        )}
      </div>

      <Separator />

      <FilterSection title={t("filters.brand")}>
        <CheckboxFilter
          options={BRAND_OPTIONS}
          selected={filters.brands}
          onToggle={(v) => toggleArrayFilter("brands", v)}
        />
      </FilterSection>

      <Separator />

      <FilterSection title={t("filters.priceRange")}>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder={t("filters.min")}
            value={
              filters.minPrice > DEFAULT_MIN_PRICE ? filters.minPrice : ""
            }
            onChange={(e) => handleMinPriceChange(e.target.value)}
            className="h-8 text-sm"
          />
          <span className="text-muted-foreground text-sm">{t("filters.to")}</span>
          <Input
            type="number"
            placeholder={t("filters.max")}
            value={
              filters.maxPrice < DEFAULT_MAX_PRICE ? filters.maxPrice : ""
            }
            onChange={(e) => handleMaxPriceChange(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
      </FilterSection>

      <Separator />

      <FilterSection title={t("filters.category")}>
        <CheckboxFilter
          options={categoryOptions}
          selected={filters.categories}
          onToggle={(v) => toggleArrayFilter("categories", v)}
        />
      </FilterSection>

      <Separator />

      <FilterSection title={t("filters.gender")}>
        <CheckboxFilter
          options={genderOptions}
          selected={filters.genders}
          onToggle={(v) => toggleArrayFilter("genders", v)}
        />
      </FilterSection>

      <Separator />

      <FilterSection title={t("filters.caseSize")}>
        <CheckboxFilter
          options={CASE_SIZE_OPTIONS}
          selected={filters.caseSizes}
          onToggle={(v) => toggleArrayFilter("caseSizes", v)}
        />
      </FilterSection>

      <Separator />

      <FilterSection title={t("filters.condition")}>
        <CheckboxFilter
          options={conditionOptions}
          selected={filters.conditions}
          onToggle={(v) => toggleArrayFilter("conditions", v)}
        />
      </FilterSection>
    </div>
  )
}
