import Link from "next/link"
import { watches } from "@/data/watches"
import { WatchCard } from "@/components/watches/watch-card"

export function FeaturedWatches() {
  const featuredWatches = watches.filter((w) => w.featured).slice(0, 8)

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Handpicked for You
            </p>
            <h2 className="font-serif text-3xl font-bold">
              Featured Timepieces
            </h2>
          </div>
          <Link
            href="/collections"
            className="text-sm uppercase tracking-wider text-muted-foreground hover:text-gold transition-colors hidden sm:block"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredWatches.map((watch) => (
            <WatchCard key={watch.id} watch={watch} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/collections"
            className="text-sm uppercase tracking-wider text-muted-foreground hover:text-gold transition-colors"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  )
}
