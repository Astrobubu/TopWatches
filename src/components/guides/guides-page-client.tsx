"use client"

import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "@/lib/i18n/context"
import { Clock, ArrowRight, BookOpen } from "lucide-react"
import type { BlogPost } from "@/lib/blog"

interface GuidesPageClientProps {
  guides: BlogPost[]
}

export function GuidesPageClient({ guides }: GuidesPageClientProps) {
  const { t } = useTranslation()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary/60 mb-3">
          {t("guidesPage.knowledge")}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
          {t("guidesPage.title")}
        </h1>
        <p className="text-foreground/50 font-sans max-w-2xl mx-auto">
          {t("guidesPage.subtitle")}
        </p>
      </div>

      {/* Guides Grid */}
      {guides.length === 0 ? (
        <div className="text-center py-20 text-foreground/40">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-primary/30" />
          <p className="font-sans text-lg mb-2">{t("guidesPage.comingSoon")}</p>
          <p className="text-sm">{t("guidesPage.comingSoonDesc")}</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 mt-6 text-primary text-sm font-sans"
          >
            {t("guidesPage.visitBlog")} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <Link key={guide.id} href={`/blog/${guide.slug}`} className="group">
              <article
                className="h-full flex flex-col p-6 bg-muted/20 hover:bg-muted/40 transition-colors"
                style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}
              >
                {guide.cover_image && (
                  <div className="relative aspect-[16/10] overflow-hidden mb-4 -mx-6 -mt-6" style={{ borderRadius: "var(--card-radius) var(--card-radius) 0 0" }}>
                    <Image
                      src={guide.cover_image}
                      alt={guide.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-3.5 h-3.5 text-primary/60" />
                  <span className="flex items-center gap-1 text-foreground/40 text-xs">
                    <Clock className="w-3 h-3" />
                    {guide.reading_time} {t("guidesPage.minRead")}
                  </span>
                </div>
                <h2 className="font-serif text-lg font-bold mb-2 group-hover:text-primary transition-colors flex-1">
                  {guide.title}
                </h2>
                {guide.excerpt && (
                  <p className="text-foreground/50 text-sm font-sans line-clamp-3 mb-4">
                    {guide.excerpt}
                  </p>
                )}
                <span className="flex items-center gap-1 text-primary text-sm font-sans font-medium mt-auto">
                  {t("guidesPage.readGuide")} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
