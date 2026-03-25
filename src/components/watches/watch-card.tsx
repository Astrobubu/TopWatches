"use client"

import Link from "next/link"
import type { Watch } from "@/lib/types"
import { useTranslation } from "@/lib/i18n/context"

interface WatchCardProps {
  watch: Watch
}

function extractMM(caseSize: string | undefined): string | null {
  if (!caseSize) return null
  const match = caseSize.match(/(\d+(?:\.\d+)?)\s*mm/i)
  return match ? `${match[1]}mm` : null
}

export function WatchCard({ watch }: WatchCardProps) {
  const { t } = useTranslation()
  const mm = extractMM(watch.specs?.caseSize)
  const details = [
    watch.reference ? `Ref. ${watch.reference}` : null,
    watch.specs?.year ? `${watch.specs.year}` : null,
  ].filter(Boolean)

  return (
    <Link href={`/watches/${watch.id}`} className="group block">
      <div className="bg-card overflow-hidden transition-all duration-500 hover:-translate-y-1" style={{ borderRadius: 'var(--card-radius)', boxShadow: 'var(--soft-shadow, 0 2px 20px rgba(44,40,36,0.08))' }}>
        {/* Image */}
        <div className="relative overflow-hidden aspect-square bg-card">
          <img
            src={watch.images[0]}
            alt={`${watch.brand} ${watch.model}`}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent" />
          {/* Condition badge */}
          <span className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-foreground/80 text-xs uppercase tracking-widest font-sans px-2.5 py-1" style={{ borderRadius: 'var(--pill-radius)' }}>
            {t(`conditions.${watch.condition}`)}
          </span>
          {/* MM size badge */}
          {mm && (
            <span className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs uppercase tracking-widest font-sans px-2.5 py-1" style={{ borderRadius: 'var(--pill-radius)' }}>
              {mm}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="font-sans text-xs text-primary tracking-widest uppercase mb-1">
            {watch.brand}
          </p>
          <h3 className="font-sans font-semibold text-base text-foreground leading-tight truncate mb-1">
            {watch.model}
          </h3>
          {details.length > 0 && (
            <p className="font-sans text-xs text-foreground/60 truncate mb-2">
              {details.join(" \u00b7 ")}
            </p>
          )}
          <p className="font-serif italic text-xl text-foreground flex items-center gap-1">
            <span className="font-sans text-sm text-foreground/70 not-italic">{t("currency")}</span>
            {watch.price.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  )
}

