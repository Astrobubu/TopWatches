"use client"

import Link from "next/link"
import { Shield, Award, Lock } from "lucide-react"

const stats = [
  { value: "10,000+", label: "Watches Sold" },
  { value: "50+", label: "Brands" },
  { value: "120+", label: "Countries" },
  { value: "99.8%", label: "Satisfaction" },
]

const values = [
  {
    icon: Shield,
    title: "Authentication",
    description:
      "Every watch undergoes multi-point inspection by certified watchmakers. We verify serial numbers, movements, and provenance.",
  },
  {
    icon: Award,
    title: "Expert Curation",
    description:
      "Our team hand-selects each timepiece. Only watches meeting our standards for condition and authenticity are listed.",
  },
  {
    icon: Lock,
    title: "Secure Transactions",
    description:
      "Bank-level encryption and buyer protection on every transaction. Escrow service ensures your payment is secure until delivery.",
  },
]

export function AboutContent() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden -mt-20 pt-20">
        <img
          src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1920&q=80"
          alt="Watch workshop"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold">About Top Watches</h1>
          <p className="text-white/70 mt-2">Gold Souq, Dubai — Trusted since day one</p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Our Story</h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Top Watches was founded in the heart of Dubai's Gold Souq to create a
              trusted destination for buying and selling luxury timepieces. Located in
              the Al Dukhan Building, we connect collectors with verified watches from
              the world&apos;s top brands.
            </p>
            <p>
              Our team of certified watchmakers inspects and authenticates every
              watch that passes through our shop. We prioritize transparency, accuracy,
              and reliable service — whether you visit us in person or shop online.
            </p>
            <p>
              From Rolex to Patek Philippe, every watch in our collection has
              been verified for authenticity, condition, and provenance.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="dark-section py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold font-serif italic text-primary">{stat.value}</p>
              <p className="text-xs opacity-50 mt-1 uppercase tracking-wide font-mono">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold mb-6 text-foreground">Why Top Watches</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-card p-6 transition-all"
                style={{ borderRadius: 'var(--card-radius)', boxShadow: 'var(--soft-shadow)' }}
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center bg-primary/10 text-primary" style={{ borderRadius: 'var(--pill-radius)' }}>
                  <value.icon className="h-5 w-5" />
                </div>
                <h3 className="font-medium mb-2 text-foreground">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="dark-section py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h3 className="font-mono text-primary text-xs tracking-[0.2em] mb-3 uppercase">Visit Us</h3>
          <h2 className="font-serif italic text-2xl md:text-3xl mb-4">Gold Souq, Dubai</h2>
          <p className="text-sm opacity-50 leading-relaxed">
            Al Dukhan Building — Shop No. 3, Gold Souq, near Gold Center,
            Al Daghaya, Al Sabkha, Dubai, United Arab Emirates
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <h2 className="text-xl font-semibold mb-2 text-foreground">Ready to Browse?</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Explore our collection of authenticated luxury watches.
        </p>
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3 font-sans font-bold text-sm hover:bg-foreground hover:text-background transition-colors"
          style={{ borderRadius: 'var(--pill-radius)' }}
        >
          Browse All Watches
        </Link>
      </section>
    </>
  )
}
