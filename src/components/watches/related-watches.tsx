"use client"

import { watches } from "@/data/watches"
import type { Watch } from "@/lib/types"
import { WatchCard } from "@/components/watches/watch-card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"

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
    .slice(0, 6)

  if (related.length === 0) return null

  return (
    <section className="py-16">
      <h2 className="font-serif text-2xl font-bold mb-8">You May Also Like</h2>
      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent className="-ml-4">
          {related.map((watch) => (
            <CarouselItem
              key={watch.id}
              className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4"
            >
              <WatchCard watch={watch} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  )
}
