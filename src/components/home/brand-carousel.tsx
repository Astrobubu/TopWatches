"use client"

import Link from "next/link"
import { brands } from "@/data/brands"

export function BrandCarousel() {
  return (
    <section className="py-10 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/collections?brand=${brand.id}`}
              className="flex items-center justify-center h-12 px-6 border rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              {brand.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
