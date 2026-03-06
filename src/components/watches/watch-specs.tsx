"use client"

import type { Watch } from "@/lib/types"
import { useTranslation } from "@/lib/i18n/context"

interface WatchSpecsProps {
  specs: Watch["specs"]
}

export function WatchSpecs({ specs }: WatchSpecsProps) {
  const { t } = useTranslation()

  const specRows = [
    { label: t("specs.movement"), value: specs.movement },
    { label: t("specs.caseMaterial"), value: specs.caseMaterial },
    { label: t("specs.caseSize"), value: specs.caseSize },
    { label: t("specs.waterResistance"), value: specs.waterResistance },
    { label: t("specs.dialColor"), value: specs.dialColor },
    { label: t("specs.bracelet"), value: specs.bracelet },
    { label: t("specs.powerReserve"), value: specs.powerReserve },
    { label: t("specs.year"), value: specs.year.toString() },
  ]

  return (
    <div className="space-y-0">
      {specRows.map((row) => (
        <div
          key={row.label}
          className="flex justify-between py-3 border-b border-foreground/10"
        >
          <span className="text-foreground/40 text-sm font-mono">{row.label}</span>
          <span className="text-foreground text-sm font-sans text-right max-w-[60%]">{row.value}</span>
        </div>
      ))}
    </div>
  )
}
