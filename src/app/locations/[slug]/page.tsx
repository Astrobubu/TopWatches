import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { getLocationPage, getLocationPages } from "@/lib/locations"
import { FAQSchema, BreadcrumbSchema, JsonLd } from "@/components/seo/json-ld"
import { MapPin, ArrowRight, MessageCircle, ChevronDown } from "lucide-react"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await getLocationPage(slug)
  if (!page) return { title: "Location Not Found" }

  return {
    title: page.seo_title || `Buy Luxury Watches in ${page.area_name}, Dubai | Golden Planet Watches`,
    description: page.seo_description || `Explore authenticated luxury watches in ${page.area_name}, Dubai. Rolex, Patek Philippe, AP & more. Free delivery across Dubai. WhatsApp us today.`,
    openGraph: {
      title: `Luxury Watches in ${page.area_name}, Dubai | Golden Planet Watches`,
      description: `Authenticated luxury watches in ${page.area_name}. Rolex, Patek Philippe, Audemars Piguet & more.`,
      images: page.hero_image ? [{ url: page.hero_image }] : [],
    },
  }
}

function FAQAccordion({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <details key={i} className="group" open={i === 0}>
          <summary className="flex items-center justify-between cursor-pointer p-4 font-sans font-semibold text-sm hover:text-primary transition-colors list-none" style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}>
            {faq.question}
            <ChevronDown className="w-4 h-4 text-foreground/40 group-open:rotate-180 transition-transform" />
          </summary>
          <div className="px-4 pb-4 pt-2 text-foreground/60 text-sm font-sans leading-relaxed">
            {faq.answer}
          </div>
        </details>
      ))}
    </div>
  )
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await getLocationPage(slug)
  if (!page) return notFound()

  const allLocations = await getLocationPages()
  const nearbyLocations = allLocations.filter(
    (l) => page.nearby_areas.includes(l.slug) && l.slug !== page.slug
  )

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://goldenplanetwatches.com" },
          { name: `Luxury Watches in ${page.area_name}`, url: `https://goldenplanetwatches.com/luxury-watches-in-${page.slug}` },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Golden Planet Watches",
          description: `Luxury watch dealer serving ${page.area_name}, Dubai`,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Al Dukhan Building, Shop No. 3, Gold Souq",
            addressLocality: "Dubai",
            addressCountry: "AE",
          },
          areaServed: { "@type": "Place", name: `${page.area_name}, Dubai` },
          priceRange: "$$$$",
        }}
      />
      {page.faqs.length > 0 && <FAQSchema faqs={page.faqs} />}

      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative h-[50vh] min-h-[400px] flex items-end overflow-hidden -mt-20">
          {page.hero_image && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={page.hero_image}
                alt={`Luxury watches in ${page.area_name}, Dubai`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </>
          )}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-32 w-full">
            <nav className="flex items-center gap-2 text-sm font-sans text-foreground/50 mb-4">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="text-border">/</span>
              <span className="text-foreground/70">Luxury Watches in {page.area_name}</span>
            </nav>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary/70">
                {page.area_name}, Dubai
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Luxury Watches in {page.area_name}
            </h1>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Introduction */}
          <section className="max-w-3xl mb-16">
            <div
              className="prose prose-lg max-w-none prose-p:text-foreground/70 prose-p:font-sans prose-p:leading-relaxed prose-headings:font-serif prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: page.intro_text }}
            />
          </section>

          {/* Why Buy Here */}
          <section className="mb-16">
            <h2 className="font-serif text-3xl font-bold mb-6">
              Why Buy Luxury Watches in {page.area_name}?
            </h2>
            <div
              className="prose prose-lg max-w-3xl prose-p:text-foreground/70 prose-p:font-sans prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-foreground/70 prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: page.why_buy_here }}
            />
          </section>

          {/* Landmarks */}
          {page.landmarks.length > 0 && (
            <section className="mb-16">
              <h2 className="font-serif text-3xl font-bold mb-6">
                Nearby Landmarks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {page.landmarks.map((landmark, i) => (
                  <div
                    key={i}
                    className="p-6 bg-muted/20"
                    style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}
                  >
                    <h3 className="font-sans font-bold text-base mb-2">{landmark.name}</h3>
                    <p className="text-foreground/50 text-sm font-sans leading-relaxed">
                      {landmark.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Featured Watches CTA */}
          <section className="mb-16 p-8 bg-muted/20 text-center" style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}>
            <h2 className="font-serif text-2xl font-bold mb-3">
              Browse Our Collection
            </h2>
            <p className="text-foreground/50 font-sans mb-6 max-w-lg mx-auto">
              Explore authenticated luxury watches available for delivery to {page.area_name} and across Dubai.
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-sans font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ borderRadius: "var(--card-radius)" }}
            >
              View All Watches <ArrowRight className="w-4 h-4" />
            </Link>
          </section>

          {/* FAQs */}
          {page.faqs.length > 0 && (
            <section className="mb-16">
              <h2 className="font-serif text-3xl font-bold mb-6">
                Frequently Asked Questions
              </h2>
              <div className="max-w-3xl">
                <FAQAccordion faqs={page.faqs} />
              </div>
            </section>
          )}

          {/* Map */}
          {page.map_embed && (
            <section className="mb-16">
              <h2 className="font-serif text-3xl font-bold mb-6">
                Our Location
              </h2>
              <div
                className="aspect-[2/1] overflow-hidden"
                style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}
                dangerouslySetInnerHTML={{ __html: page.map_embed }}
              />
            </section>
          )}

          {/* Nearby Areas */}
          {nearbyLocations.length > 0 && (
            <section className="mb-16">
              <h2 className="font-serif text-2xl font-bold mb-6">
                Also Serving Nearby
              </h2>
              <div className="flex flex-wrap gap-3">
                {nearbyLocations.map((loc) => (
                  <Link
                    key={loc.slug}
                    href={`/luxury-watches-in-${loc.slug}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-sans text-foreground/60 hover:text-primary hover:border-primary/40 transition-colors"
                    style={{ borderRadius: "var(--pill-radius)", border: "var(--border-w) solid var(--border)" }}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Luxury Watches in {loc.area_name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Internal Links */}
          <section className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/blog" className="p-4 text-sm font-sans text-foreground/60 hover:text-primary hover:border-primary/30 transition-colors" style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}>
              Read our luxury watch blog &rarr;
            </Link>
            <Link href="/guides" className="p-4 text-sm font-sans text-foreground/60 hover:text-primary hover:border-primary/30 transition-colors" style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}>
              Watch buying guides &rarr;
            </Link>
            <Link href="/condition-guide" className="p-4 text-sm font-sans text-foreground/60 hover:text-primary hover:border-primary/30 transition-colors" style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}>
              Condition grading guide &rarr;
            </Link>
          </section>

          {/* WhatsApp CTA */}
          <section className="p-8 text-center" style={{ borderRadius: "var(--card-radius)", background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 80%, black) 100%)" }}>
            <h2 className="font-serif text-2xl font-bold mb-2 text-primary-foreground">
              Looking for a Specific Watch in {page.area_name}?
            </h2>
            <p className="text-primary-foreground/70 font-sans mb-6 max-w-lg mx-auto text-sm">
              Our experts can help you find the perfect timepiece. Chat with us on WhatsApp for personalized recommendations.
            </p>
            <a
              href={`https://wa.me/971507452323?text=${encodeURIComponent(`Hi, I'm looking for a luxury watch in ${page.area_name}, Dubai`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-sans font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ borderRadius: "var(--card-radius)" }}
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </section>
        </div>
      </div>
    </>
  )
}
