"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslation } from "@/lib/i18n/context"

interface SortDropdownProps {
  value: string
  onChange: (value: string) => void
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const { t } = useTranslation()

  const sortOptions = [
    { value: "featured", label: t("sort.featured") },
    { value: "price-asc", label: t("sort.priceLow") },
    { value: "price-desc", label: t("sort.priceHigh") },
    { value: "newest", label: t("sort.newest") },
    { value: "brand", label: t("sort.brandAZ") },
  ]

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t("sort.sortBy")} />
      </SelectTrigger>
      <SelectContent position="popper" align="end">
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
