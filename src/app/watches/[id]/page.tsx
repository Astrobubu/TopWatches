import { notFound } from "next/navigation"
import { getWatchById } from "@/lib/get-watches"
import { WatchDetailContent } from "./watch-detail-content"
import { ProductSchema, BreadcrumbSchema } from "@/components/seo/json-ld"
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
      ? `${watch.brand} ${watch.model} ${watch.reference} | Golden Planet Watches Dubai`
      : "Watch Not Found",
    description: watch
      ? `Buy authenticated ${watch.condition} ${watch.brand} ${watch.model} (Ref. ${watch.reference}) in Dubai. Price: AED ${watch.price?.toLocaleString()}. WhatsApp us for details.`
      : undefined,
    openGraph: watch
      ? {
          title: `${watch.brand} ${watch.model} | Golden Planet Watches`,
          description: `${watch.condition} ${watch.brand} ${watch.model} (Ref. ${watch.reference}) - AED ${watch.price?.toLocaleString()}`,
          images: watch.images?.[0] ? [{ url: watch.images[0] }] : [],
          type: "website",
        }
      : undefined,
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
    <>
      <ProductSchema
        name={`${watch.brand} ${watch.model}`}
        brand={watch.brand}
        description={watch.description || `${watch.condition} ${watch.brand} ${watch.model} (Ref. ${watch.reference})`}
        price={watch.price}
        image={watch.images?.[0] || ""}
        condition={watch.condition}
        reference={watch.reference}
        url={`https://goldenplanetwatches.com/watches/${watch.id}`}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://goldenplanetwatches.com" },
          { name: "Collections", url: "https://goldenplanetwatches.com/collections" },
          { name: watch.brand, url: `https://goldenplanetwatches.com/collections?brand=${watch.brand.toLowerCase().replace(/\s+/g, "-")}` },
          { name: `${watch.brand} ${watch.model}`, url: `https://goldenplanetwatches.com/watches/${watch.id}` },
        ]}
      />
      <WatchDetailContent watch={watch} />
    </>
  )
}
