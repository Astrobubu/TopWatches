import type { MetadataRoute } from "next"
import { supabase } from "@/lib/supabase"

const BASE_URL = "https://goldenplanetwatches.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/collections`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/for-him`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/for-her`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/condition-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/review`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ]

  // Watch detail pages
  let watchPages: MetadataRoute.Sitemap = []
  if (supabase) {
    const { data: watches } = await supabase
      .from("watches")
      .select("id, created_at")
      .order("created_at", { ascending: false })

    if (watches) {
      watchPages = watches.map((w) => ({
        url: `${BASE_URL}/watches/${w.id}`,
        lastModified: new Date(w.created_at),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
    }
  }

  // Blog posts
  let blogPages: MetadataRoute.Sitemap = []
  if (supabase) {
    try {
      const { data: posts } = await supabase
        .from("blog_posts")
        .select("slug, published_at, updated_at")
        .eq("status", "published")
        .order("published_at", { ascending: false })

      if (posts) {
        blogPages = posts.map((p) => ({
          url: `${BASE_URL}/blog/${p.slug}`,
          lastModified: new Date(p.updated_at || p.published_at),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }))
      }
    } catch { /* table may not exist yet */ }
  }

  // Location pages
  let locationPages: MetadataRoute.Sitemap = []
  if (supabase) {
    try {
      const { data: locations } = await supabase
        .from("location_pages")
        .select("slug, updated_at")
        .eq("published", true)

      if (locations) {
        locationPages = locations.map((l) => ({
          url: `${BASE_URL}/luxury-watches-in-${l.slug}`,
          lastModified: new Date(l.updated_at),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }))
      }
    } catch { /* table may not exist yet */ }
  }

  return [...staticPages, ...watchPages, ...blogPages, ...locationPages]
}
