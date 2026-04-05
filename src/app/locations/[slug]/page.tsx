import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getLocationPage, getLocationPages } from "@/lib/locations"
import { FAQSchema, BreadcrumbSchema, JsonLd } from "@/components/seo/json-ld"
import { LocationPageClient } from "@/components/locations/location-page-client"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await getLocationPage(slug)
  if (!page) return { title: "Location Not Found" }

  return {
    title: page.seo_title || `Buy Luxury Watches in ${page.area_name}, Dubai | Golden Planet Watches`,
    description: page.seo_description || `Explore authenticated luxury watches in ${page.area_name}, Dubai. Rolex, Patek Philippe, AP & more. Free delivery across Dubai. WhatsApp us today.`,
    openGraph: {
      title: `Luxury Watches in ${page.area_name}, Dubai | Golden Planet Watches`,
      description: `Authenticated luxury watches in ${page.area_name}. Rolex, Patek Philippe, Audemars Piguet & more.`,
      images: page.hero_image ? [{ url: page.hero_image }] : [],
    },
  }
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await getLocationPage(slug)
  if (!page) return notFound()

  const allLocations = await getLocationPages()
  const nearbyLocations = allLocations
    .filter((l) => page.nearby_areas.includes(l.slug) && l.slug !== page.slug)
    .map((l) => ({ slug: l.slug, area_name: l.area_name }))

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://goldenplanetwatches.com" },
          { name: `Luxury Watches in ${page.area_name}`, url: `https://goldenplanetwatches.com/luxury-watches-in-${page.slug}` },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Golden Planet Watches",
          description: `Luxury watch dealer serving ${page.area_name}, Dubai`,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Al Dukhan Building, Shop No. 3, Gold Souq",
            addressLocality: "Dubai",
            addressCountry: "AE",
          },
          areaServed: { "@type": "Place", name: `${page.area_name}, Dubai` },
          priceRange: "$$$$",
        }}
      />
      {page.faqs.length > 0 && <FAQSchema faqs={page.faqs} />}

      <LocationPageClient page={page} nearbyLocations={nearbyLocations} />
    </>
  )
}
