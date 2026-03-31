"use client"

import Link from "next/link"
import { ImageGallery } from "@/components/watches/image-gallery"
import { WatchSpecs } from "@/components/watches/watch-specs"
import { RelatedWatches } from "@/components/watches/related-watches"
import { ConditionBadge } from "@/components/watches/condition-badge"
import { WhatsAppOrder } from "@/components/watches/whatsapp-order"
import { useTranslation } from "@/lib/i18n/context"
import type { Watch } from "@/lib/types"

export function WatchDetailContent({ watch }: { watch: Watch }) {
  const { t } = useTranslation()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm font-sans text-foreground/60 mb-8">
        <Link href="/" className="hover:text-primary transition-colors">{t("detail.home")}</Link>
        <span className="text-border">/</span>
        <Link href="/collections" className="hover:text-primary transition-colors">{t("nav.collections")}</Link>
        <span className="text-border">/</span>
        <Link
          href={`/collections?brand=${watch.brand.toLowerCase().replace(/\s+/g, "-")}`}
          className="hover:text-primary transition-colors"
        >
          {watch.brand}
        </Link>
        <span className="text-border">/</span>
        <span className="text-foreground/70">{watch.model}</span>
      </nav>

      {/* Main product section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Left: Image Gallery */}
        <ImageGallery images={watch.images} imageVariants={watch.imageVariants} modelName={`${watch.brand} ${watch.model}`} />

        {/* Right: Product Info */}
        <div className="space-y-6">
          <div>
            <p className="font-sans text-sm text-primary tracking-[0.2em] uppercase mb-2">
              {watch.brand}
            </p>
            <h1 className="text-3xl md:text-4xl font-sans font-bold text-foreground">
              {watch.model}
            </h1>
            <p className="font-sans text-sm text-foreground/60 mt-2">
              Ref. {watch.reference}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ConditionBadge condition={watch.condition} />
            <span className="text-foreground/70 text-xs uppercase tracking-widest font-sans px-3 py-1 bg-foreground/10" style={{ borderRadius: 'var(--pill-radius)' }}>
              {watch.category}
            </span>
          </div>

          <div className="border-t border-foreground/10 pt-6">
            <p className="font-serif italic text-4xl text-foreground flex items-center gap-2">
              <span className="font-sans text-lg text-foreground/70 not-italic">AED</span>
              {watch.price.toLocaleString()}
            </p>
          </div>

          <WhatsAppOrder watch={watch} />

          <div className="border-t border-foreground/10 pt-6">
            <h3 className="font-sans font-bold text-base text-foreground mb-3">{t("detail.description")}</h3>
            <p className="text-base text-foreground/70 leading-relaxed">
              {watch.description}
            </p>
          </div>

          <div className="border-t border-foreground/10 pt-6">
            <h3 className="font-sans font-bold text-base text-foreground mb-4">{t("detail.specifications")}</h3>
            <WatchSpecs watch={watch} />
          </div>
        </div>
      </div>

      {/* Related watches */}
      <RelatedWatches currentWatch={watch} />
    </div>
  )
}
