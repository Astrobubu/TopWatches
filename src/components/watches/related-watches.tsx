"use client"

import { watches } from "@/data/watches"
import type { Watch } from "@/lib/types"
import { WatchCard } from "@/components/watches/watch-card"

interface RelatedWatchesProps {
  currentWatch: Watch
}

export function RelatedWatches({ currentWatch }: RelatedWatchesProps) {
  const related = watches
    .filter(
      (w) =>
        w.id !== currentWatch.id &&
        (w.brand === currentWatch.brand || w.category === currentWatch.category)
    )
    .slice(0, 4)

  if (related.length === 0) return null

  return (
    <section className="py-12 border-t border-border mt-12">
      <h2 className="font-serif italic text-2xl text-foreground mb-8">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {related.map((watch) => (
          <WatchCard key={watch.id} watch={watch} />
        ))}
      </div>
    </section>
  )
}
