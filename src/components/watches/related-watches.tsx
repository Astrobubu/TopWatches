"use client"

import { useEffect, useState } from "react"
import type { Watch } from "@/lib/types"
import { WatchCard } from "@/components/watches/watch-card"
import { useTranslation } from "@/lib/i18n/context"

interface RelatedWatchesProps {
  currentWatch: Watch
}

export function RelatedWatches({ currentWatch }: RelatedWatchesProps) {
  const { t } = useTranslation()
  const [related, setRelated] = useState<Watch[]>([])

  useEffect(() => {
    fetch("/api/watches")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const filtered = data
            .filter(
              (w: Watch) =>
                w.id !== currentWatch.id &&
                (w.brand === currentWatch.brand || w.category === currentWatch.category)
            )
            .slice(0, 4)
          setRelated(filtered)
        }
      })
      .catch(() => {})
  }, [currentWatch.id, currentWatch.brand, currentWatch.category])

  if (related.length === 0) return null

  return (
    <section className="py-12 border-t border-foreground/10 mt-12">
      <h2 className="font-serif italic text-2xl text-foreground mb-8">{t("related.title")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {related.map((watch) => (
          <WatchCard key={watch.id} watch={watch} />
        ))}
      </div>
    </section>
  )
}
