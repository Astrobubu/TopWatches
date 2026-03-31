"use client"

import Link from "next/link"
import { Shield, Award, Lock } from "lucide-react"
import { useTranslation } from "@/lib/i18n/context"

export function AboutContent() {
  const { t } = useTranslation()

  const stats = [
    { value: "16+", label: t("about.yearsInBusiness") },
    { value: "10,000+", label: t("about.watchesSold") },
    { value: "50+", label: t("about.brands") },
    { value: "99.8%", label: t("about.satisfaction") },
  ]

  const values = [
    {
      icon: Shield,
      title: t("about.authTitle"),
      description: t("about.authDesc"),
    },
    {
      icon: Award,
      title: t("about.curationTitle"),
      description: t("about.curationDesc"),
    },
    {
      icon: Lock,
      title: t("about.secureTitle"),
      description: t("about.secureDesc"),
    },
  ]

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
          <h1 className="text-4xl md:text-5xl font-bold">{t("about.title")}</h1>
          <p className="text-white/70 mt-2">{t("about.location")}</p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-xl font-semibold mb-4 text-foreground">{t("about.ourStory")}</h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>{t("about.storyP1")}</p>
            <p>{t("about.storyP2")}</p>
            <p>{t("about.storyP3")}</p>
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
          <h2 className="text-xl font-semibold mb-6 text-foreground">{t("about.whyUs")}</h2>
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
          <h3 className="font-mono text-primary text-xs tracking-[0.2em] mb-3 uppercase">{t("about.visitUs")}</h3>
          <h2 className="font-serif italic text-2xl md:text-3xl mb-4">{t("about.visitLocation")}</h2>
          <p className="text-sm opacity-50 leading-relaxed">
            {t("about.visitAddress")}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <h2 className="text-xl font-semibold mb-2 text-foreground">{t("about.readyBrowse")}</h2>
        <p className="text-sm text-muted-foreground mb-6">
          {t("about.exploreCollection")}
        </p>
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3 font-sans font-bold text-sm hover:bg-foreground hover:text-background transition-colors"
          style={{ borderRadius: 'var(--pill-radius)' }}
        >
          {t("about.browseAll")}
        </Link>
      </section>
    </>
  )
}
