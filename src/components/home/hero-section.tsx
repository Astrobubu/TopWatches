import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-end pb-20 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1600003014608-c2ccc1570a65?w=1920&q=80"
        alt="Luxury timepiece"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <p className="text-sm uppercase tracking-[0.3em] mb-4 text-gold">
          Exceptional Timepieces
        </p>
        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">
          Discover Timeless
          <br />
          Elegance
        </h1>
        <p className="text-lg text-white/80 mb-8 max-w-xl">
          The world&apos;s most trusted marketplace for luxury watches.
          Authenticated, insured, and delivered worldwide.
        </p>
        <div className="flex gap-4">
          <Button
            asChild
            className="bg-gold hover:bg-gold/90 text-white rounded-none px-8 py-6 text-sm uppercase tracking-wider"
          >
            <Link href="/collections">Explore Collection</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-white text-white hover:bg-white/10 rounded-none px-8 py-6 text-sm uppercase tracking-wider"
          >
            <Link href="/about">Our Story</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
