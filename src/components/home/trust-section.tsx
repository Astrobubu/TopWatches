"use client"

import { Shield, Truck, RotateCcw } from "lucide-react"
import { FadeIn } from "@/components/ui/fade-in"

const pillars = [
  {
    icon: Shield,
    title: "Certified Authentic",
    description:
      "Every timepiece undergoes rigorous authentication by our expert watchmakers",
  },
  {
    icon: Truck,
    title: "Worldwide Shipping",
    description:
      "Fully insured delivery to over 120 countries with real-time tracking",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description:
      "14-day hassle-free return policy with full money-back guarantee",
  },
]

export function TrustSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {pillars.map((pillar, index) => (
            <FadeIn key={pillar.title} delay={index * 0.15}>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
                <pillar.icon className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2">
                {pillar.title}
              </h3>
              <p className="text-muted-foreground">{pillar.description}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
