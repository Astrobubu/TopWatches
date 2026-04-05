"use client"

import Link from "next/link"
import { useTranslation } from "@/lib/i18n/context"
import { MapPin, ArrowRight, MessageCircle, ChevronDown } from "lucide-react"
import type { LocationPage } from "@/lib/locations"

interface LocationPageClientProps {
  page: LocationPage
  nearbyLocations: { slug: string; area_name: string }[]
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

export function LocationPageClient({ page, nearbyLocations }: LocationPageClientProps) {
  const { t } = useTranslation()

  const waMessage = `${t("locations.waMessage")} ${page.area_name}, Dubai`

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end overflow-hidden -mt-20">
        {page.hero_image && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={page.hero_image}
              alt={`${t("locations.luxuryWatchesIn")} ${page.area_name}, Dubai`}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </>
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-32 w-full">
          <nav className="flex items-center gap-2 text-sm font-sans text-foreground/50 mb-4">
            <Link href="/" className="hover:text-primary transition-colors">{t("locations.home")}</Link>
            <span className="text-border">/</span>
            <span className="text-foreground/70">{t("locations.luxuryWatchesIn")} {page.area_name}</span>
          </nav>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary/70">
              {page.area_name}, Dubai
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {t("locations.luxuryWatchesIn")} {page.area_name}
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
            {t("locations.whyBuyIn")} {page.area_name}?
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
              {t("locations.nearbyLandmarks")}
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
            {t("locations.browseCollection")}
          </h2>
          <p className="text-foreground/50 font-sans mb-6 max-w-lg mx-auto">
            {t("locations.exploreAuth")} {page.area_name} {t("locations.andAcrossDubai")}
          </p>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-sans font-semibold text-sm hover:opacity-90 transition-opacity"
            style={{ borderRadius: "var(--card-radius)" }}
          >
            {t("locations.viewAllWatches")} <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* FAQs */}
        {page.faqs.length > 0 && (
          <section className="mb-16">
            <h2 className="font-serif text-3xl font-bold mb-6">
              {t("locations.faq")}
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
              {t("locations.ourLocation")}
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
              {t("locations.alsoServing")}
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
                  {t("locations.luxuryWatchesIn")} {loc.area_name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Internal Links */}
        <section className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/blog" className="p-4 text-sm font-sans text-foreground/60 hover:text-primary hover:border-primary/30 transition-colors" style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}>
            {t("locations.readBlog")} &rarr;
          </Link>
          <Link href="/guides" className="p-4 text-sm font-sans text-foreground/60 hover:text-primary hover:border-primary/30 transition-colors" style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}>
            {t("locations.buyingGuides")} &rarr;
          </Link>
          <Link href="/condition-guide" className="p-4 text-sm font-sans text-foreground/60 hover:text-primary hover:border-primary/30 transition-colors" style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}>
            {t("locations.conditionGuide")} &rarr;
          </Link>
        </section>

        {/* WhatsApp CTA */}
        <section className="p-8 text-center" style={{ borderRadius: "var(--card-radius)", background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 80%, black) 100%)" }}>
          <h2 className="font-serif text-2xl font-bold mb-2 text-primary-foreground">
            {t("locations.lookingForWatch")} {page.area_name}?
          </h2>
          <p className="text-primary-foreground/70 font-sans mb-6 max-w-lg mx-auto text-sm">
            {t("locations.expertHelp")}
          </p>
          <a
            href={`https://wa.me/971507452323?text=${encodeURIComponent(waMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-sans font-semibold text-sm hover:opacity-90 transition-opacity"
            style={{ borderRadius: "var(--card-radius)" }}
          >
            <MessageCircle className="w-4 h-4" />
            {t("locations.chatWhatsApp")}
          </a>
        </section>
      </div>
    </div>
  )
}
