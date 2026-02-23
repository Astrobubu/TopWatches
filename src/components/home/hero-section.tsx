"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function HeroSection() {
  return (
    <section className="relative h-[100dvh] min-h-[450px] flex items-center overflow-hidden">
      <img
        src="https://swisswatches-magazine.com/uploads/2024/09/rolex-submariner-titlepicture.webp"
        alt="Rolex Submariner"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/80" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full mt-auto mb-20 lg:mb-32">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif italic text-foreground mb-6 leading-[0.9] tracking-tighter">
            The<br />Collection.
          </h1>
          <p className="text-base md:text-lg font-mono text-foreground/60 mb-10 max-w-md">
            Authenticated luxury timepieces. Acquired directly. Verified by experts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/collections"
              className="magnetic-btn bg-primary text-background px-8 py-4 rounded-full font-bold text-sm tracking-wide flex items-center justify-center hover:bg-foreground"
            >
              Enter Boutique
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
