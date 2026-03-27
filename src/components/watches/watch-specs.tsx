"use client"

import type { Watch } from "@/lib/types"
import { useTranslation } from "@/lib/i18n/context"

interface WatchSpecsProps {
  watch: Watch
}

export function WatchSpecs({ watch }: WatchSpecsProps) {
  const { t } = useTranslation()
  const { specs } = watch

  const gender = watch.gender || "men"

  const specRows = [
    { label: t("specs.referenceNumber"), value: watch.reference },
    { label: t("specs.yearOfProduction"), value: specs.year ? specs.year.toString() : undefined },
    { label: t("specs.gender"), value: t(`genders.${gender}`) },
    { label: t("specs.condition"), value: t(`conditions.${watch.condition}`) },
    { label: t("specs.scope"), value: watch.scope },
    { label: t("specs.movement"), value: specs.movement },
    { label: t("specs.caseMaterial"), value: specs.caseMaterial },
    { label: t("specs.caseSize"), value: specs.caseSize },
    { label: t("specs.dialColor"), value: specs.dialColor },
    { label: t("specs.bracelet"), value: specs.bracelet },
  ].filter(row => row.value)

  return (
    <div className="space-y-0">
      {specRows.map((row) => (
        <div
          key={row.label}
          className="flex justify-between py-3 border-b border-foreground/10"
        >
          <span className="text-foreground/60 text-base font-sans">{row.label}</span>
          <span className="text-foreground text-base font-sans text-right max-w-[60%]">{row.value}</span>
        </div>
      ))}
    </div>
  )
}
