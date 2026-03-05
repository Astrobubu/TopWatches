"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { WatchCard } from "@/components/watches/watch-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { Watch } from "@/lib/types"

export function FeaturedWatches() {
  const [featuredWatches, setFeaturedWatches] = useState<Watch[]>([])

  useEffect(() => {
    fetch("/api/watches")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFeaturedWatches(data.filter((w: Watch) => w.featured).slice(0, 8))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Featured Watches</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/collections" className="text-muted-foreground">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredWatches.map((watch) => (
            <WatchCard key={watch.id} watch={watch} />
          ))}
        </div>
      </div>
    </section>
  )
}
