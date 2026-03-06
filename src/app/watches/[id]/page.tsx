import { notFound } from "next/navigation"
import { getWatchById } from "@/lib/get-watches"
import { WatchDetailContent } from "./watch-detail-content"
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

  return <WatchDetailContent watch={watch} />
}
