"use client"

import Link from "next/link"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"
import { brands } from "@/data/brands"
import { FadeIn } from "@/components/ui/fade-in"

export function BrandCarousel() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Curated Selection
            </p>
            <h2 className="font-serif text-3xl font-bold">Shop by Brand</h2>
          </div>
        </FadeIn>
        <div className="px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              {brands.map((brand) => (
                <CarouselItem
                  key={brand.id}
                  className="basis-1/3 md:basis-1/5 lg:basis-1/7"
                >
                  <Link
                    href={`/collections?brand=${brand.id}`}
                    className="flex items-center justify-center h-20 border border-border hover:border-gold/50 transition-colors"
                  >
                    <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                      {brand.name}
                    </span>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  )
}
