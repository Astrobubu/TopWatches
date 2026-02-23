import Link from "next/link"
import type { Watch } from "@/lib/types"

interface WatchCardProps {
  watch: Watch
}

export function WatchCard({ watch }: WatchCardProps) {
  return (
    <Link href={`/watches/${watch.id}`} className="group block">
      <div className="bg-card overflow-hidden transition-all duration-500 hover:-translate-y-1" style={{ borderRadius: 'var(--card-radius)', border: 'var(--border-w) solid var(--border)' }}>
        {/* Image */}
        <div className="relative overflow-hidden aspect-square bg-background">
          <img
            src={watch.images[0]}
            alt={`${watch.brand} ${watch.model}`}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent" />
          {/* Condition badge */}
          <span className="absolute top-3 right-3 bg-background/70 backdrop-blur-sm text-foreground/70 text-[10px] uppercase tracking-widest font-mono px-2.5 py-1" style={{ borderRadius: 'var(--pill-radius)', border: 'var(--border-w) solid var(--border)' }}>
            {watch.condition}
          </span>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="font-mono text-[10px] text-primary tracking-widest uppercase mb-1">
            {watch.brand}
          </p>
          <h3 className="font-sans font-semibold text-sm text-foreground leading-tight truncate mb-2">
            {watch.model}
          </h3>
          <p className="font-serif italic text-lg text-foreground flex items-center gap-1">
            <span className="font-mono text-xs text-muted-foreground not-italic">AED</span>
            {watch.price.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  )
}

