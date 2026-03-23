"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRight, Camera, ClipboardList } from "lucide-react"
import { brands } from "@/data/brands"
import { WatchCard } from "@/components/watches/watch-card"
import { WatchCardSkeleton } from "@/components/watches/watch-card-skeleton"
import { ConciergeSystem } from "@/components/home/concierge-system"
import { GoogleReviews } from "@/components/home/google-reviews"
import { useTranslation } from "@/lib/i18n/context"
import type { Watch } from "@/lib/types"

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  const mainRef = useRef<HTMLDivElement>(null)
  const [watches, setWatches] = useState<Watch[]>([])
  const { t } = useTranslation()

  useEffect(() => {
    fetch("/api/watches")
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setWatches(data) })
      .catch(() => {})
  }, [])

  // Merge all notable watches into one curated grid (8 watches, no duplicates)
  const curatedWatches = useMemo(() => {
    const curatedIds = new Set<string>()
    const result: Watch[] = []
    const sources = [
      watches.filter(w => w.featured),
      watches.filter(w => ["rolex-daytona-116500ln", "patek-philippe-nautilus-5711-1a", "ap-royal-oak-15500st", "omega-speedmaster-moonwatch"].includes(w.id)),
      watches.filter(w => w.specs.year === 2024),
    ]
    for (const src of sources) {
      for (const w of src) {
        if (!curatedIds.has(w.id) && result.length < 8) {
          curatedIds.add(w.id)
          result.push(w)
        }
      }
    }
    return result
  }, [watches])
  const [conciergeOpen, setConciergeOpen] = useState(false)
  const [conciergeFlow, setConciergeFlow] = useState<"upload" | "questions" | null>(null)

  // Hero animation — runs once on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-elem", {
        y: 50, opacity: 0, stagger: 0.1, duration: 1.4, ease: "power3.out", delay: 0.2,
      })
    }, mainRef)
    return () => ctx.revert()
  }, [])

  // Section animations — re-run when watches load (layout shifts)
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.refresh()
      document.querySelectorAll(".anim-section").forEach(el => {
        gsap.from(el.querySelectorAll(".anim-item"), {
          scrollTrigger: { trigger: el, start: "top 85%" },
          y: 40, opacity: 0, stagger: 0.15, duration: 1, ease: "power3.out",
        })
      })
    }, mainRef)
    return () => ctx.revert()
  }, [curatedWatches])

  return (
    <div ref={mainRef}>
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative h-[100dvh] w-full flex items-end -mt-20 select-none">
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="https://swisswatches-magazine.com/uploads/2024/09/rolex-submariner-titlepicture.webp"
            alt="Luxury Watch Background"
            className="w-full h-full object-cover object-right-top md:object-center opacity-50 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 pb-16 md:pb-24">
          <div>
            <h1 className="hero-elem text-4xl sm:text-5xl md:text-7xl leading-[1.1] text-foreground">
              <span className="font-sans font-bold block tracking-tight">{t("hero.line1")}</span>
              <span className="font-serif italic font-light block">{t("hero.line2")}</span>
            </h1>
            <p className="hero-elem text-foreground/50 text-sm md:text-lg max-w-md mt-6 mb-8 font-sans font-light">
              {t("hero.subtitle")}
            </p>
            <div className="hero-elem">
              <Link
                href="/collections"
                className="magnetic-btn group relative overflow-hidden inline-flex items-center justify-center gap-3 bg-foreground text-background px-7 py-3.5 font-sans font-semibold text-sm md:text-base"
                style={{ borderRadius: 'var(--pill-radius)' }}
              >
                <span className="relative z-10">{t("hero.cta")}</span>
                <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ CURATED SELECTION (dark bg) ═══════════════════ */}
      <section
        className="anim-section dark-section py-20 md:py-28 px-6 md:px-16"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-14">
            <div>
              <h3 className="anim-item font-mono text-primary text-xs tracking-[0.2em] mb-2 uppercase">{t("home.curatedSelection")}</h3>
              <h2 className="anim-item font-serif italic text-3xl md:text-4xl">{t("home.finestTimepieces")}</h2>
            </div>
            <Link href="/collections" className="anim-item font-sans text-sm text-primary hover:opacity-80 transition-opacity flex items-center gap-1">
              {t("home.viewAll")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {curatedWatches.length === 0
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="anim-item"><WatchCardSkeleton /></div>
                ))
              : curatedWatches.map(w => (
                  <div key={w.id} className="anim-item"><WatchCard watch={w} /></div>
                ))
            }
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOR HIM & HER SPLIT (light bg) ═══════════════════ */}
      <section className="anim-section py-20 px-6 md:px-16 max-w-7xl mx-auto select-none">
        <div className="text-center mb-12">
          <h3 className="anim-item font-mono text-primary text-xs tracking-[0.2em] mb-2 uppercase">{t("home.curated")}</h3>
          <h2 className="anim-item font-serif italic text-3xl md:text-5xl text-foreground">{t("home.findYourFit")}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px] md:h-[600px] anim-item">
          <Link
            href="/for-him"
            className="group block h-full flex items-end p-10 bg-cover bg-center transition-all duration-500"
            style={{
              borderRadius: "var(--container-radius)",
              backgroundImage: "url('https://i.pinimg.com/1200x/a2/ab/aa/a2abaad39785e84615742e5c50e68772.jpg')",
            }}
          >
            <div
              className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"
              style={{ borderRadius: "var(--container-radius)" }}
            />
            <div className="relative z-10 w-full flex items-end justify-between">
              <div>
                <h3 className="font-serif italic text-4xl text-foreground mb-2">{t("home.forHim")}</h3>
                <p className="font-mono text-xs text-foreground/50 tracking-widest uppercase">{t("home.above39mm")}</p>
              </div>
              <div className="w-12 h-12 rounded-full border border-foreground/20 flex items-center justify-center text-foreground group-hover:bg-primary group-hover:border-primary group-hover:text-background transition-colors">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>

          <Link
            href="/for-her"
            className="group block h-full flex items-end p-10 bg-cover bg-center transition-all duration-500"
            style={{
              borderRadius: "var(--container-radius)",
              backgroundImage: "url('https://hijabi.pk/cdn/shop/files/gemini-image-2_photography_of_the_uploaded_image_is_a_reference_of_hijab_hijab_matching_bracele-0_fbb79dd1-962d-4944-a2c7-d74fecf663d3.jpg?v=1765878218')",
            }}
          >
            <div
              className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"
              style={{ borderRadius: "var(--container-radius)" }}
            />
            <div className="relative z-10 w-full flex items-end justify-between">
              <div>
                <h3 className="font-serif italic text-4xl text-foreground mb-2">{t("home.forHer")}</h3>
                <p className="font-mono text-xs text-foreground/50 tracking-widest uppercase">{t("home.under39mm")}</p>
              </div>
              <div className="w-12 h-12 rounded-full border border-foreground/20 flex items-center justify-center text-foreground group-hover:bg-primary group-hover:border-primary group-hover:text-background transition-colors">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ═══════════════════ GOOGLE REVIEWS (dark bg — handled inside component) ═══════════════════ */}
      <GoogleReviews />

      {/* ═══════════════════ PERSONAL CONCIERGE (light bg) ═══════════════════ */}
      <section className="anim-section py-20 md:py-32 px-6 md:px-16 select-none">
        <div className="max-w-5xl mx-auto text-center mb-12 md:mb-16">
          <h3 className="anim-item font-mono text-primary text-xs tracking-[0.2em] mb-3 uppercase">{t("concierge.title")}</h3>
          <h2 className="anim-item font-serif italic text-3xl md:text-5xl text-foreground mb-4">{t("concierge.subtitle")}</h2>
          <p className="anim-item font-sans text-foreground/50 max-w-lg mx-auto">
            {t("concierge.description")}
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            onClick={() => {
              setConciergeFlow("upload")
              setConciergeOpen(true)
            }}
            className="group relative rounded-[var(--container-radius)] overflow-hidden min-h-[350px] flex items-end p-8 md:p-10 transition-all duration-500 cursor-pointer rounded-clip"
            style={{ boxShadow: 'var(--soft-shadow)' }}
          >
            <img
              src="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=1600"
              alt="Luxury watch style"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

            <div className="relative z-10 w-full">
              <div className="w-12 h-12 rounded-full bg-foreground/10 backdrop-blur-md flex items-center justify-center text-foreground mb-4 group-hover:scale-110 transition-transform">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-2xl text-foreground mb-2">{t("concierge.uploadTitle")}</h3>
              <p className="text-foreground/70 text-sm leading-relaxed mb-6 max-w-sm">
                {t("concierge.uploadDesc")}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-foreground text-sm font-sans font-semibold">{t("concierge.uploadBtn")}</span>
                <div className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-background transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <div
            onClick={() => {
              setConciergeFlow("questions")
              setConciergeOpen(true)
            }}
            className="group relative rounded-[var(--container-radius)] overflow-hidden min-h-[350px] flex items-end p-8 md:p-10 transition-all duration-500 cursor-pointer rounded-clip"
            style={{ boxShadow: 'var(--soft-shadow)' }}
          >
            <img
              src="https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=1600"
              alt="Watch questionnaire"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

            <div className="relative z-10 w-full">
              <div className="w-12 h-12 rounded-full bg-foreground/10 backdrop-blur-md flex items-center justify-center text-foreground mb-4 group-hover:scale-110 transition-transform">
                <ClipboardList className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-2xl text-foreground mb-2">{t("concierge.questionnaireTitle")}</h3>
              <p className="text-foreground/70 text-sm leading-relaxed mb-6 max-w-sm">
                {t("concierge.questionnaireDesc")}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-foreground text-sm font-sans font-semibold">{t("concierge.questionnaireBtn")}</span>
                <div className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-background transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ BRANDS (quiet, dark bg) ═══════════════════ */}
      <section
        className="py-16 md:py-20"
        style={{ backgroundColor: 'var(--dark-section-bg)', color: 'var(--dark-section-text)' }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-16 dark-section-animate">
          <h3 className="font-mono text-center text-xs tracking-[0.3em] mb-10 uppercase" style={{ color: 'var(--primary)', opacity: 0.6 }}>{t("home.authorizedBrands")}</h3>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {brands.map(brand => (
              <Link
                key={brand.id}
                href={`/collections?brand=${brand.id}`}
                className="font-sans text-lg md:text-xl font-medium transition-all dark-section-link"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ConciergeSystem isOpen={conciergeOpen} setIsOpen={setConciergeOpen} initialFlow={conciergeFlow} />
    </div>
  )
}
