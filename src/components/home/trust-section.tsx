"use client"

import { Shield, Truck, RotateCcw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const pillars = [
  {
    icon: Shield,
    title: "Authenticated",
    description: "Every watch is verified by certified watchmakers before listing",
  },
  {
    icon: Truck,
    title: "Insured Shipping",
    description: "Fully insured delivery to over 120 countries with tracking",
  },
  {
    icon: RotateCcw,
    title: "14-Day Returns",
    description: "Full money-back guarantee within 14 days of delivery",
  },
]

export function TrustSection() {
  return (
    <section className="py-12 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar) => (
            <Card key={pillar.title} className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                  <pillar.icon className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="font-medium mb-1">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground">{pillar.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
