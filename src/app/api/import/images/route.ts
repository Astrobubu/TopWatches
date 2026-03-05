import { NextRequest, NextResponse } from "next/server"
import * as cheerio from "cheerio"

interface ImageResult {
  url: string
  source: string
  thumbnail?: string
  label?: string
}

const BRAND_SLUGS: Record<string, string> = {
  rolex: "rolex",
  "patek philippe": "patek-philippe",
  "audemars piguet": "audemars-piguet",
  omega: "omega",
  cartier: "cartier",
  "tag heuer": "tag-heuer",
  iwc: "iwc",
  breitling: "breitling",
  tudor: "tudor",
  "vacheron constantin": "vacheron-constantin",
  "jaeger-lecoultre": "jaeger-lecoultre",
  panerai: "panerai",
  hublot: "hublot",
  zenith: "zenith",
  "grand seiko": "grand-seiko",
  longines: "longines",
  tissot: "tissot",
  blancpain: "blancpain",
  chopard: "chopard",
  "richard mille": "richard-mille",
}

const COLLECTION_SLUGS: Record<string, Record<string, string>> = {
  rolex: {
    submariner: "submariner",
    "submariner date": "submariner",
    datejust: "datejust",
    "gmt-master": "gmt-master-ii",
    "gmt-master ii": "gmt-master-ii",
    daytona: "daytona",
    "cosmograph daytona": "daytona",
    "day-date": "day-date",
    "sea-dweller": "sea-dweller",
    "sky-dweller": "sky-dweller",
    explorer: "explorer",
    "explorer ii": "explorer-ii",
    milgauss: "milgauss",
    "yacht-master": "yacht-master",
    "air-king": "air-king",
    "oyster perpetual": "oyster-perpetual",
  },
  omega: {
    speedmaster: "speedmaster",
    seamaster: "seamaster",
    constellation: "constellation",
    "de ville": "de-ville",
  },
  "patek-philippe": {
    nautilus: "nautilus",
    aquanaut: "aquanaut",
    calatrava: "calatrava",
  },
  "audemars-piguet": {
    "royal oak": "royal-oak",
    "royal oak offshore": "royal-oak-offshore",
  },
  cartier: {
    santos: "santos",
    tank: "tank",
    pasha: "pasha",
  },
  "tag-heuer": {
    carrera: "carrera",
    monaco: "monaco",
    aquaracer: "aquaracer",
  },
}

function parseQuery(query: string): { brand: string; collection: string; reference: string } {
  const q = query.trim().toLowerCase()
  const refMatch = q.match(/\b([a-z]?\d[\w\-\.\/]+)\s*$/i) || q.match(/\b(\d{4,}[\w\-\.]*)\b/i)
  const reference = refMatch ? refMatch[1] : ""
  const withoutRef = reference ? q.replace(reference, "").trim() : q

  let brandSlug = ""
  let detectedBrand = ""
  for (const [name, slug] of Object.entries(BRAND_SLUGS)) {
    if (withoutRef.includes(name) || q.includes(name)) {
      detectedBrand = name
      brandSlug = slug
      break
    }
  }

  let collectionSlug = ""
  if (brandSlug && COLLECTION_SLUGS[brandSlug]) {
    const remaining = withoutRef.replace(detectedBrand, "").trim()
    for (const [name, slug] of Object.entries(COLLECTION_SLUGS[brandSlug])) {
      if (remaining.includes(name) || q.includes(name)) {
        collectionSlug = slug
        break
      }
    }
  }

  return { brand: brandSlug, collection: collectionSlug, reference }
}

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
}

function extractCdnImages($: cheerio.CheerioAPI): { url: string; thumbnail: string }[] {
  const images: { url: string; thumbnail: string }[] = []
  $("img").each((_, el) => {
    const src = $(el).attr("src") || $(el).attr("data-src") || ""
    if (src.includes("cdn.watchbase.com") && src.includes("/watch/")) {
      const lgUrl = src.replace(/\/watch\/(?:lg|md|sm|)(?=\/)/, "/watch/lg")
      const mdUrl = src.replace(/\/watch\/(?:lg|md|sm|)(?=\/)/, "/watch/md")
      if (!images.some((img) => img.url === lgUrl)) {
        images.push({ url: lgUrl, thumbnail: mdUrl })
      }
    }
  })
  return images
}

async function fetchDetailPageImages(url: string): Promise<ImageResult[]> {
  try {
    const res = await fetch(url, { headers: FETCH_HEADERS, redirect: "follow" })
    if (!res.ok) return []
    const html = await res.text()
    const $ = cheerio.load(html)
    const h1 = $("h1").first().text().trim()
    return extractCdnImages($).map((img) => ({
      ...img,
      source: "watchbase",
      label: h1,
    }))
  } catch {
    return []
  }
}

async function scrapeWatchbaseImages(query: string): Promise<{ exact: ImageResult[]; related: ImageResult[] }> {
  const parsed = parseQuery(query)
  if (!parsed.brand) return { exact: [], related: [] }

  // --- 1. Find the exact watch page and get its image ---
  const exact: ImageResult[] = []
  const candidateUrls: string[] = []

  if (parsed.collection && parsed.reference) {
    candidateUrls.push(`https://watchbase.com/${parsed.brand}/${parsed.collection}/${parsed.reference}`)
  }
  if (parsed.reference) {
    candidateUrls.push(`https://watchbase.com/${parsed.brand}/${parsed.reference}`)
    if (COLLECTION_SLUGS[parsed.brand]) {
      for (const slug of Object.values(COLLECTION_SLUGS[parsed.brand])) {
        if (!candidateUrls.some((u) => u.includes(`/${slug}/`))) {
          candidateUrls.push(`https://watchbase.com/${parsed.brand}/${slug}/${parsed.reference}`)
        }
      }
    }
  }

  let foundCollection = parsed.collection
  for (const url of candidateUrls) {
    const imgs = await fetchDetailPageImages(url)
    if (imgs.length > 0) {
      exact.push(...imgs)
      // Extract collection from the URL that worked
      const parts = url.replace("https://watchbase.com/", "").split("/")
      if (parts.length >= 3) foundCollection = parts[1]
      break
    }
  }

  // --- 2. Scrape the collection page for related variant images ---
  const related: ImageResult[] = []
  if (foundCollection) {
    try {
      const collectionUrl = `https://watchbase.com/${parsed.brand}/${foundCollection}`
      const res = await fetch(collectionUrl, { headers: FETCH_HEADERS, redirect: "follow" })
      if (res.ok) {
        const html = await res.text()
        const $ = cheerio.load(html)

        // Get base reference (e.g., "126603" from "126603-0001")
        const baseRef = parsed.reference.split("-")[0]

        // Find links to variant pages and their images
        const variantLinks: { url: string; label: string }[] = []
        $("a[href]").each((_, el) => {
          const href = $(el).attr("href") || ""
          const text = $(el).text().trim()
          // Only include variants of the same base reference, or similar watches
          if (href.includes(`watchbase.com/${parsed.brand}/${foundCollection}/`)) {
            const refInUrl = href.split("/").pop() || ""
            // Same base reference but different variant
            if (baseRef && refInUrl.startsWith(baseRef) && refInUrl !== parsed.reference) {
              variantLinks.push({ url: href, label: text })
            }
          }
        })

        // Also grab images directly visible on the collection page
        const collectionImages = extractCdnImages($)
        for (const img of collectionImages) {
          // Skip if it's the exact same image we already have
          if (!exact.some((e) => e.url === img.url)) {
            // Check if this image path contains our base reference
            if (baseRef && img.url.includes(baseRef)) {
              related.push({ ...img, source: "watchbase", label: "Variant" })
            }
          }
        }

        // Fetch up to 3 variant detail pages for their images
        const variantFetches = variantLinks.slice(0, 3).map(async (v) => {
          const imgs = await fetchDetailPageImages(v.url)
          return imgs.map((img) => ({ ...img, label: v.label }))
        })
        const variantResults = await Promise.all(variantFetches)
        for (const imgs of variantResults) {
          for (const img of imgs) {
            if (!exact.some((e) => e.url === img.url) && !related.some((r) => r.url === img.url)) {
              related.push(img)
            }
          }
        }
      }
    } catch {
      // ignore collection page errors
    }
  }

  return { exact, related }
}

async function searchBingImages(query: string): Promise<ImageResult[]> {
  try {
    const searchQuery = `${query} watch white background`
    const url = `https://www.bing.com/images/search?q=${encodeURIComponent(searchQuery)}&form=HDRSC2&first=1`
    const res = await fetch(url, {
      headers: {
        ...FETCH_HEADERS,
        Accept: "text/html",
      },
    })

    if (!res.ok) return []

    const html = await res.text()
    const images: ImageResult[] = []

    // Bing embeds image URLs in JSON-like data as murl (media URL) and turl (thumbnail URL)
    // Pattern: "murl":"https://...","turl":"https://..."
    const murlRegex = /murl&quot;:&quot;(https?:\/\/[^&]+?)&quot;/g
    const turlRegex = /turl&quot;:&quot;(https?:\/\/[^&]+?)&quot;/g

    const murls: string[] = []
    const turls: string[] = []

    let match
    while ((match = murlRegex.exec(html)) !== null) {
      murls.push(match[1])
    }
    while ((match = turlRegex.exec(html)) !== null) {
      turls.push(match[1])
    }

    for (let i = 0; i < murls.length && images.length < 12; i++) {
      const imageUrl = murls[i]
      // Skip very long URLs (tracking/redirect junk)
      if (imageUrl.length > 500) continue
      // Skip data URIs
      if (imageUrl.startsWith("data:")) continue

      if (!images.some((img) => img.url === imageUrl)) {
        images.push({
          url: imageUrl,
          source: "bing",
          thumbnail: turls[i] || imageUrl,
        })
      }
    }

    return images
  } catch {
    return []
  }
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "query is required" }, { status: 400 })
    }

    // Run Watchbase and Bing in parallel
    const [watchbase, bing] = await Promise.all([
      scrapeWatchbaseImages(query),
      searchBingImages(query),
    ])

    // Watchbase exact match first, then Bing results, then Watchbase variants
    const allImages = [
      ...watchbase.exact,
      ...bing,
      ...watchbase.related,
    ]

    // Deduplicate
    const seen = new Set<string>()
    const uniqueImages = allImages.filter((img) => {
      if (seen.has(img.url)) return false
      seen.add(img.url)
      return true
    })

    return NextResponse.json({
      images: uniqueImages,
      total: uniqueImages.length,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
