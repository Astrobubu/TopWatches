import { notFound } from "next/navigation"
import Link from "next/link"
import { ImageGallery } from "@/components/watches/image-gallery"
import { WatchSpecs } from "@/components/watches/watch-specs"
import { RelatedWatches } from "@/components/watches/related-watches"
import { ConditionBadge } from "@/components/watches/condition-badge"
import { WhatsAppOrder } from "@/components/watches/whatsapp-order"
import { getWatchById } from "@/lib/get-watches"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const watch = await getWatchById(id)
  return {
    title: watch
      ? `${watch.brand} ${watch.model} | TopWatches`
      : "Watch Not Found",
  }
}

export default async function WatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const watch = await getWatchById(id)
  if (!watch) return notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm font-mono text-foreground/40 mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="text-border">/</span>
        <Link href="/collections" className="hover:text-primary transition-colors">Collections</Link>
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
        <ImageGallery images={watch.images} modelName={`${watch.brand} ${watch.model}`} />

        {/* Right: Product Info */}
        <div className="space-y-6">
          <div>
            <p className="font-mono text-xs text-primary tracking-[0.2em] uppercase mb-2">
              {watch.brand}
            </p>
            <h1 className="text-2xl md:text-3xl font-sans font-bold text-foreground">
              {watch.model}
            </h1>
            <p className="font-mono text-xs text-foreground/40 mt-2">
              Ref. {watch.reference}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ConditionBadge condition={watch.condition} />
            <span className="text-foreground/50 text-[10px] uppercase tracking-widest font-mono px-3 py-1 bg-muted/50" style={{ borderRadius: 'var(--pill-radius)' }}>
              {watch.category}
            </span>
          </div>

          <div className="border-t border-foreground/10 pt-6">
            <p className="font-serif italic text-4xl text-foreground flex items-center gap-2">
              <span className="font-mono text-base text-muted-foreground not-italic">AED</span>
              {watch.price.toLocaleString()}
            </p>
          </div>

          <WhatsAppOrder watch={watch} />

          <div className="border-t border-foreground/10 pt-6">
            <h3 className="font-sans font-bold text-sm text-foreground mb-3">Description</h3>
            <p className="text-sm text-foreground/50 leading-relaxed">
              {watch.description}
            </p>
          </div>

          <div className="border-t border-foreground/10 pt-6">
            <h3 className="font-sans font-bold text-sm text-foreground mb-4">Specifications</h3>
            <WatchSpecs specs={watch.specs} />
          </div>
        </div>
      </div>

      {/* Related watches */}
      <RelatedWatches currentWatch={watch} />
    </div>
  )
}
