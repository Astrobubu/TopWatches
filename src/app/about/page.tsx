import Link from "next/link"
import { Shield, Award, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "About | KRONOS",
  description:
    "Learn about Kronos — the world's most trusted luxury watch marketplace",
}

const stats = [
  { value: "10,000+", label: "Watches Sold" },
  { value: "50+", label: "Premium Brands" },
  { value: "120+", label: "Countries Served" },
  { value: "99.8%", label: "Satisfaction Rate" },
]

const values = [
  {
    icon: Shield,
    title: "Authentication Guarantee",
    description:
      "Every watch undergoes a multi-point inspection by our certified watchmakers. We verify serial numbers, movements, and provenance to ensure absolute authenticity before any timepiece reaches our marketplace.",
  },
  {
    icon: Award,
    title: "Expert Curation",
    description:
      "Our team of certified watchmakers and horological experts hand-select each timepiece in our collection. Only watches that meet our exacting standards for condition, authenticity, and desirability are presented to our clients.",
  },
  {
    icon: Lock,
    title: "Secure Transactions",
    description:
      "Bank-level encryption and buyer protection safeguard every transaction. Our escrow service ensures your payment is secure until you've received and inspected your timepiece, providing complete peace of mind.",
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1920&q=80"
          alt="Luxury timepieces"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center text-white">
          <p className="text-sm uppercase tracking-[0.3em] text-gold mb-4">
            Our Story
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold">
            About Kronos
          </h1>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold mb-8">
            A Legacy of Trust
          </h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              Founded with a singular vision &mdash; to create the most trusted
              destination for luxury timepieces &mdash; Kronos has grown from a
              passionate idea into a global marketplace connecting discerning
              collectors with the world&apos;s finest watches.
            </p>
            <p>
              Our team of certified watchmakers personally inspects and
              authenticates every timepiece that passes through our platform. We
              believe that acquiring a luxury watch should be an experience
              marked by confidence, transparency, and unparalleled service.
            </p>
            <p>
              From the iconic Rolex Submariner to the legendary Patek Philippe
              Nautilus, every watch in our collection has been carefully vetted to
              ensure authenticity, condition, and provenance. We stand behind
              every sale with our comprehensive guarantee.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Bar */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-4xl md:text-5xl font-bold text-gold">
                {stat.value}
              </p>
              <p className="text-sm uppercase tracking-wider text-muted-foreground mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Values / Trust Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-gold mb-4">
              Why Choose Us
            </p>
            <h2 className="font-serif text-3xl font-bold">
              Built on Trust & Expertise
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
                  <value.icon className="h-8 w-8 text-gold" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <h2 className="font-serif text-3xl font-bold mb-4">
          Ready to Find Your Timepiece?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Browse our curated collection of authenticated luxury watches from the
          world&apos;s most prestigious brands.
        </p>
        <Button
          asChild
          className="bg-gold hover:bg-gold/90 text-white rounded-none px-8 py-6 text-sm uppercase tracking-wider"
        >
          <Link href="/collections">Explore Collection</Link>
        </Button>
      </section>
    </>
  )
}
