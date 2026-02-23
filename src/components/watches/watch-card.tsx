import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Watch } from "@/lib/types"

interface WatchCardProps {
  watch: Watch
}

export function WatchCard({ watch }: WatchCardProps) {
  return (
    <Link href={`/watches/${watch.id}`} className="group">
      <Card className="overflow-hidden border-0 shadow-none bg-transparent rounded-none gap-0">
        <div className="relative overflow-hidden">
          <img
            src={watch.images[0]}
            alt={watch.model}
            className="aspect-[4/5] object-cover w-full transition-transform duration-500 group-hover:scale-105"
          />
          <Badge
            variant="secondary"
            className="absolute top-3 right-3 rounded-sm text-[10px] uppercase tracking-wider"
          >
            {watch.condition}
          </Badge>
        </div>
        <CardContent className="px-0 pt-4 pb-0">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {watch.brand}
          </p>
          <h3 className="font-serif font-semibold text-lg leading-tight mt-1">
            {watch.model}
          </h3>
          <p className="text-lg font-bold mt-1">
            ${watch.price.toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
