export function WatchCardSkeleton() {
  return (
    <div
      className="bg-card overflow-hidden"
      style={{ borderRadius: "var(--card-radius)", boxShadow: "var(--soft-shadow, 0 2px 20px rgba(44,40,36,0.08))" }}
    >
      {/* Image placeholder */}
      <div className="aspect-square bg-muted/40 animate-pulse" />

      {/* Info placeholder */}
      <div className="p-4 space-y-2.5">
        <div className="h-2.5 w-16 bg-muted/50 animate-pulse rounded-sm" />
        <div className="h-3.5 w-3/4 bg-muted/40 animate-pulse rounded-sm" />
        <div className="h-2 w-1/2 bg-muted/30 animate-pulse rounded-sm" />
        <div className="h-5 w-24 bg-muted/40 animate-pulse rounded-sm mt-1" />
      </div>
    </div>
  )
}
