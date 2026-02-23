"use client"

import Link from "next/link"
import { FadeIn } from "@/components/ui/fade-in"

const categories = [
  {
    name: "Dress Watches",
    slug: "dress",
    image:
      "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=800&h=1000&fit=crop&q=80",
    count: 5,
  },
  {
    name: "Sport Watches",
    slug: "sport",
    image:
      "https://images.unsplash.com/photo-1548171916-c0dea7f94ca6?w=800&h=1000&fit=crop&q=80",
    count: 4,
  },
  {
    name: "Dive Watches",
    slug: "dive",
    image:
      "https://images.unsplash.com/photo-1662384205880-2c7a9879cc0c?w=800&h=1000&fit=crop&q=80",
    count: 2,
  },
  {
    name: "Chronographs",
    slug: "chronograph",
    image:
      "https://images.unsplash.com/photo-1634140704051-58a787556cd1?w=800&h=1000&fit=crop&q=80",
    count: 5,
  },
]

export function CategoriesSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Browse Categories
            </p>
            <h2 className="font-serif text-3xl font-bold">Find Your Style</h2>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, index) => (
            <FadeIn key={cat.slug} delay={index * 0.1}>
              <Link href={`/collections?category=${cat.slug}`}>
                <div className="relative h-80 overflow-hidden group">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
                    <h3 className="font-serif text-2xl font-bold">{cat.name}</h3>
                    <p className="text-sm text-white/70 mt-1">
                      {cat.count} watches
                    </p>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
