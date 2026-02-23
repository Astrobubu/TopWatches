"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRight, Shield, Truck, RotateCcw, Camera, ClipboardList, Sparkles } from "lucide-react"
import { watches } from "@/data/watches"
import { brands } from "@/data/brands"
import { WatchCard } from "@/components/watches/watch-card"
import { ConciergeSystem } from "@/components/home/concierge-system"
import { useState } from "react"

gsap.registerPlugin(ScrollTrigger)

const featuredWatches = watches.filter(w => w.featured)
const newArrivals = watches.filter(w => w.specs.year === 2024).slice(0, 4)
const popularChoices = watches
  .filter(w => ["rolex-daytona-116500ln", "patek-philippe-nautilus-5711-1a", "ap-royal-oak-15500st", "omega-speedmaster-moonwatch"].includes(w.id))

const forHimWatches = watches.filter(w => parseInt(w.specs.caseSize) >= 39).slice(0, 4)
const forHerWatches = watches.filter(w => parseInt(w.specs.caseSize) < 39).slice(0, 4)

export default function HomePage() {
  const mainRef = useRef<HTMLDivElement>(null)
  const [conciergeOpen, setConciergeOpen] = useState(false)
  const [conciergeFlow, setConciergeFlow] = useState<"upload" | "questions" | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-elem", {
        y: 50, opacity: 0, stagger: 0.1, duration: 1.4, ease: "power3.out", delay: 0.2,
      })

      document.querySelectorAll(".anim-section").forEach(el => {
        gsap.from(el.querySelectorAll(".anim-item"), {
          scrollTrigger: { trigger: el, start: "top 80%" },
          y: 40, opacity: 0, stagger: 0.15, duration: 1, ease: "power3.out",
        })
      })

      gsap.from(".philo-elem", {
        scrollTrigger: { trigger: "#manifesto", start: "top 75%" },
        y: 40, opacity: 0, stagger: 0.15, duration: 1.2, ease: "power3.out",
      })
    }, mainRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={mainRef}>
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative h-[100dvh] w-full flex items-end -mt-20">
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="https://swisswatches-magazine.com/uploads/2024/09/rolex-submariner-titlepicture.webp"
            alt="Luxury Watch Background"
            className="w-full h-full object-cover object-right-top md:object-center opacity-50 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 pb-16 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div>
              <h1 className="hero-elem text-4xl sm:text-5xl md:text-7xl leading-[1.1] text-foreground">
                <span className="font-sans font-bold block tracking-tight">Acquire the</span>
                <span className="font-serif italic font-light block">Exceptional.</span>
              </h1>
              <p className="hero-elem text-foreground/50 text-sm md:text-lg max-w-md mt-6 mb-8 font-sans font-light">
                {watches.length} authenticated luxury watches from {brands.length} top brands. Every piece verified by expert Swiss watchmakers.
              </p>
              <div className="hero-elem flex flex-col sm:flex-row gap-3">
                <Link
                  href="/collections"
                  className="magnetic-btn group relative overflow-hidden inline-flex items-center justify-center gap-3 bg-foreground text-background px-7 py-3.5 font-sans font-semibold text-sm md:text-base"
                  style={{ borderRadius: 'var(--pill-radius)' }}
                >
                  <span className="relative z-10">Enter the Collection</span>
                  <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0" />
                </Link>
                <Link
                  href="/condition-guide"
                  className="inline-flex items-center justify-center gap-2 text-foreground/70 px-7 py-3.5 font-sans text-sm hover:border-primary/50 hover:text-primary transition-colors"
                  style={{ borderRadius: 'var(--pill-radius)', border: 'var(--border-w) solid var(--border)' }}
                >
                  Condition Guide
                </Link>
              </div>
            </div>
            {/* Hero Stats */}
            <div className="hero-elem hidden lg:grid grid-cols-3 gap-6">
              {[
                { value: watches.length.toString(), label: "Timepieces" },
                { value: brands.length.toString(), label: "Maisons" },
                { value: "100%", label: "Authenticated" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="font-serif italic text-4xl text-primary mb-1">{s.value}</div>
                  <div className="font-mono text-[10px] text-foreground/40 tracking-widest uppercase">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ NEW ARRIVALS ═══════════════════ */}
      <section className="anim-section py-20 md:py-28 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-14">
          <div>
            <h3 className="anim-item font-mono text-primary text-xs tracking-[0.2em] mb-2 uppercase">Just Landed</h3>
            <h2 className="anim-item font-serif italic text-3xl md:text-4xl text-foreground">New Arrivals</h2>
          </div>
          <Link href="/collections?sort=newest" className="anim-item font-sans text-sm text-primary hover:text-foreground transition-colors flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {newArrivals.map(w => (
            <div key={w.id} className="anim-item"><WatchCard watch={w} /></div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ POPULAR CHOICE ═══════════════════ */}
      <section className="anim-section py-20 md:py-28 px-6 md:px-16 max-w-7xl mx-auto border-t border-border/50">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-14">
          <div>
            <h3 className="anim-item font-mono text-primary text-xs tracking-[0.2em] mb-2 uppercase">Most Coveted</h3>
            <h2 className="anim-item font-serif italic text-3xl md:text-4xl text-foreground">Popular Choice</h2>
          </div>
          <Link href="/collections?sort=price-desc" className="anim-item font-sans text-sm text-primary hover:text-foreground transition-colors flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularChoices.map(w => (
            <div key={w.id} className="anim-item"><WatchCard watch={w} /></div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ FEATURED ═══════════════════ */}
      <section className="anim-section py-20 md:py-28 px-6 md:px-16 max-w-7xl mx-auto border-t border-border/50">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-14">
          <div>
            <h3 className="anim-item font-mono text-primary text-xs tracking-[0.2em] mb-2 uppercase">Curated Selection</h3>
            <h2 className="anim-item font-serif italic text-3xl md:text-4xl text-foreground">Featured Timepieces</h2>
          </div>
          <Link href="/collections" className="anim-item font-sans text-sm text-primary hover:text-foreground transition-colors flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredWatches.map(w => (
            <div key={w.id} className="anim-item"><WatchCard watch={w} /></div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ FOR HIM & HER SPLIT ═══════════════════ */}
      <section className="anim-section py-20 px-6 md:px-16 max-w-7xl mx-auto border-t border-border/50">
        <div className="text-center mb-12">
          <h3 className="anim-item font-mono text-primary text-xs tracking-[0.2em] mb-2 uppercase">Curated</h3>
          <h2 className="anim-item font-serif italic text-3xl md:text-5xl text-foreground">Find Your Fit</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px] md:h-[600px] anim-item">
          <Link href="/for-him" className="group relative rounded-[var(--container-radius)] overflow-hidden block h-full border border-border hover:border-primary/40 transition-all duration-500">
            <img
              src="https://i.pinimg.com/1200x/a2/ab/aa/a2abaad39785e84615742e5c50e68772.jpg"
              alt="For Him"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-10 flex items-end justify-between">
              <div>
                <h3 className="font-serif italic text-4xl text-foreground mb-2">For Him</h3>
                <p className="font-mono text-xs text-foreground/50 tracking-widest uppercase">39mm and above</p>
              </div>
              <div className="w-12 h-12 rounded-full border border-foreground/20 flex items-center justify-center text-foreground group-hover:bg-primary group-hover:border-primary group-hover:text-background transition-colors">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>

          <Link href="/for-her" className="group relative rounded-[var(--container-radius)] overflow-hidden block h-full border border-border hover:border-primary/40 transition-all duration-500">
            <img
              src="https://hijabi.pk/cdn/shop/files/gemini-image-2_photography_of_the_uploaded_image_is_a_reference_of_hijab_hijab_matching_bracele-0_fbb79dd1-962d-4944-a2c7-d74fecf663d3.jpg?v=1765878218"
              alt="For Her"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-10 flex items-end justify-between">
              <div>
                <h3 className="font-serif italic text-4xl text-foreground mb-2">For Her</h3>
                <p className="font-mono text-xs text-foreground/50 tracking-widest uppercase">Under 39mm</p>
              </div>
              <div className="w-12 h-12 rounded-full border border-foreground/20 flex items-center justify-center text-foreground group-hover:bg-primary group-hover:border-primary group-hover:text-background transition-colors">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ═══════════════════ PERSONAL CONCIERGE ═══════════════════ */}
      <section className="anim-section py-20 md:py-32 px-6 md:px-16 border-t border-border/50">
        <div className="max-w-5xl mx-auto text-center mb-12 md:mb-16">
          <h3 className="anim-item font-mono text-primary text-xs tracking-[0.2em] mb-3 uppercase">Personal Concierge</h3>
          <h2 className="anim-item font-serif italic text-3xl md:text-5xl text-foreground mb-4">Not sure what suits you?</h2>
          <p className="anim-item font-sans text-foreground/50 max-w-lg mx-auto">
            Let our concierge find the perfect timepiece for you. Choose how you'd like to begin.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option 1: Image */}
          <div
            onClick={() => {
              setConciergeFlow("upload")
              setConciergeOpen(true)
            }}
            className="group relative rounded-[var(--container-radius)] overflow-hidden min-h-[350px] flex items-end p-8 md:p-10 border border-border hover:border-primary/40 transition-all duration-500 cursor-pointer"
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
              <h3 className="font-sans font-bold text-2xl text-foreground mb-2">Show Us Your Style</h3>
              <p className="text-foreground/70 text-sm leading-relaxed mb-6 max-w-sm">
                Upload a photo of your clothes, a watch you like, or even a fashion look.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-foreground text-sm font-sans font-semibold">Upload Image</span>
                <div className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-background transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Option 2: Questionnaire */}
          <div
            onClick={() => {
              setConciergeFlow("questions")
              setConciergeOpen(true)
            }}
            className="group relative rounded-[var(--container-radius)] overflow-hidden min-h-[350px] flex items-end p-8 md:p-10 border border-border hover:border-primary/40 transition-all duration-500 cursor-pointer"
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
              <h3 className="font-sans font-bold text-2xl text-foreground mb-2">Answer a Few Questions</h3>
              <p className="text-foreground/70 text-sm leading-relaxed mb-6 max-w-sm">
                Tell us about your wrist size, budget, and style preferences.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-foreground text-sm font-sans font-semibold">Start Questionnaire</span>
                <div className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-background transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ BRANDS ═══════════════════ */}
      <section className="anim-section py-16 border-t border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <h3 className="anim-item font-mono text-center text-foreground/30 text-xs tracking-[0.3em] mb-10 uppercase">Authorized Brands</h3>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {brands.map(brand => (
              <Link
                key={brand.id}
                href={`/collections?brand=${brand.id}`}
                className="anim-item font-sans text-lg md:text-xl font-medium text-foreground/40 hover:text-primary transition-colors"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ TRUST PILLARS ═══════════════════ */}
      <section className="anim-section py-20 md:py-28 max-w-7xl mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: "Authenticated", desc: "Every watch is verified by certified watchmakers before listing. No exceptions." },
            { icon: Truck, title: "Insured Shipping", desc: "Fully insured delivery to over 120 countries with real-time tracking." },
            { icon: RotateCcw, title: "14-Day Returns", desc: "Full money-back guarantee within 14 days of delivery. Zero friction." },
          ].map(p => (
            <div key={p.title} className="anim-item bg-card p-8 hover:border-primary/30 transition-colors group" style={{ borderRadius: 'var(--card-radius)', border: 'var(--border-w) solid var(--border)' }}>
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform" style={{ borderRadius: 'var(--pill-radius)' }}>
                <p.icon className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-lg mb-2">{p.title}</h3>
              <p className="text-foreground/50 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ MANIFESTO ═══════════════════ */}
      <section id="manifesto" className="relative py-28 md:py-40 px-6 md:px-16 overflow-hidden border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="philo-elem font-mono text-primary text-xs tracking-widest uppercase mb-10">The Manifesto</p>
          <p className="philo-elem font-sans text-lg md:text-2xl text-foreground/40 max-w-2xl mx-auto leading-relaxed mb-12">
            Most marketplaces focus on <span className="text-foreground/70">volume, algorithm optimization, and relentless speed.</span>
          </p>
          <div className="philo-elem">
            <p className="font-sans text-xl md:text-3xl text-foreground mb-3">We focus on</p>
            <h2 className="font-serif italic text-5xl md:text-7xl text-primary leading-tight">absolute verification.</h2>
          </div>
        </div>
      </section>

      <ConciergeSystem isOpen={conciergeOpen} setIsOpen={setConciergeOpen} initialFlow={conciergeFlow} />
    </div>
  )
}
