"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    name: "Dress Watches",
    slug: "dress",
    image:
      "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=600&h=400&fit=crop&q=80",
    count: 5,
  },
  {
    name: "Sport Watches",
    slug: "sport",
    image:
      "https://images.unsplash.com/photo-1548171916-c0dea7f94ca6?w=600&h=400&fit=crop&q=80",
    count: 4,
  },
  {
    name: "Dive Watches",
    slug: "dive",
    image:
      "https://images.unsplash.com/photo-1662384205880-2c7a9879cc0c?w=600&h=400&fit=crop&q=80",
    count: 2,
  },
  {
    name: "Chronographs",
    slug: "chronograph",
    image:
      "https://images.unsplash.com/photo-1634140704051-58a787556cd1?w=600&h=400&fit=crop&q=80",
    count: 5,
  },
]

export function CategoriesSection() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/collections?category=${cat.slug}`}>
              <Card className="overflow-hidden group py-0 gap-0">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  <div className="relative z-10 h-full flex flex-col justify-end p-4 text-foreground">
                    <h3 className="font-semibold text-lg">{cat.name}</h3>
                    <p className="text-sm text-foreground/70">{cat.count} watches</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
