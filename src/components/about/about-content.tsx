"use client"

import Link from "next/link"
import { Shield, Award, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

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
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1920&q=80"
          alt="Watch workshop"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center text-foreground">
          <h1 className="text-4xl md:text-5xl font-bold">About Top Watches</h1>
          <p className="text-foreground/70 mt-2">Trusted marketplace for luxury timepieces</p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-xl font-semibold mb-4">Our Story</h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Top Watches was founded to create a trusted destination for buying
              and selling luxury timepieces. We connect collectors with verified
              watches from the world&apos;s top brands.
            </p>
            <p>
              Our team of certified watchmakers inspects and authenticates every
              watch on our platform. We prioritize transparency, accuracy, and
              reliable service.
            </p>
            <p>
              From Rolex to Patek Philippe, every watch in our collection has
              been verified for authenticity, condition, and provenance.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-12 border-y bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold mb-6">Why Top Watches</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value) => (
              <Card key={value.title}>
                <CardContent className="pt-6">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                    <value.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center border-t">
        <h2 className="text-xl font-semibold mb-2">Ready to Browse?</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Explore our collection of authenticated luxury watches.
        </p>
        <Button asChild className="bg-gold hover:bg-gold/90 text-foreground">
          <Link href="/collections">Browse All Watches</Link>
        </Button>
      </section>
    </>
  )
}
