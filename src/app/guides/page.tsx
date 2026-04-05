import type { Metadata } from "next"
import { getBlogPosts } from "@/lib/blog"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { GuidesPageClient } from "@/components/guides/guides-page-client"

export const metadata: Metadata = {
  title: "Luxury Watch Guides | Expert Knowledge for Watch Enthusiasts",
  description:
    "Comprehensive luxury watch guides from Golden Planet Watches Dubai. Rolex reference numbers, serial number lookup, authentication tips, buying guides & more.",
  openGraph: {
    title: "Luxury Watch Guides | Golden Planet Watches Dubai",
    description: "Expert watch guides: Rolex reference numbers, authentication, buying tips, and more.",
  },
}

export const dynamic = "force-dynamic"

export default async function GuidesPage() {
  const { posts: guides } = await getBlogPosts({ category: "guides", limit: 50 })

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://goldenplanetwatches.com" },
          { name: "Guides", url: "https://goldenplanetwatches.com/guides" },
        ]}
      />

      <GuidesPageClient guides={guides} />
    </>
  )
}
