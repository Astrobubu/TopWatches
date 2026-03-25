import { NextRequest, NextResponse } from "next/server"
import * as cheerio from "cheerio"

const BROWSER_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Cache-Control": "no-cache",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
}

interface RolexImage {
  url: string
  thumbnail: string
  source: string
  label?: string
}

function normalizeReference(ref: string): string {
  let r = ref.trim().toLowerCase().replace(/\s+/g, "")
  if (/^m\d+[a-z]*-\d+$/.test(r)) return r
  if (!r.startsWith("m")) r = "m" + r
  if (!r.includes("-")) r = r + "-0001"
  return r
}

function isProductImage(url: string, reference?: string): boolean {
  if (!url || !url.includes("media.rolex.com")) return false
  if (url.includes("/navigation/")) return false
  if (url.includes("/footer/")) return false
  if (url.includes("/new-watches/")) return false
  if (url.includes("family-collection")) return false
  if (url.includes("main-navigation")) return false
  if (url.includes("anim-bracelet-material")) return false
  if (url.includes("anim-") && /--\d{3,}/.test(url)) return false
  if (url.includes("/bg/feature/feature-") && !reference) return false
  if (url.includes("/bg/model-cover-background")) return false
  const isCatalogue = url.includes("/catalogue/")
  const hasRef = reference ? url.includes(reference) : false
  return isCatalogue || hasRef
}

function upgradeToHighRes(url: string): string {
  return url.replace(/c_limit,w_\d+/, "c_limit,w_2560")
}

// Build CDN image URLs directly from the reference number (bypasses 403 on rolex.com)
function buildCdnUrls(reference: string): string[] {
  const ref = reference.toLowerCase()
  const baseRef = ref.replace(/^m/, "")
  return [
    `https://media.rolex.com/image/upload/v7/catalogue/${ref}_modelpage_front_facing_landscape`,
    `https://media.rolex.com/image/upload/v7/catalogue/${ref}_modelpage_front_facing_portrait`,
    `https://media.rolex.com/image/upload/v7/catalogue/${ref}_modelpage_laying_down_shadow`,
    `https://media.rolex.com/image/upload/v7/catalogue/${baseRef}_modelpage_front_facing_landscape`,
    `https://media.rolex.com/image/upload/v7/catalogue/${baseRef}_modelpage_front_facing_portrait`,
  ]
}

async function probeImageUrl(url: string): Promise<string | null> {
  // Try common extensions — Rolex CDN serves without extension via content negotiation,
  // but also try explicit .webp and .png
  const variants = [url, `${url}.webp`, `${url}.png`]
  for (const u of variants) {
    try {
      const res = await fetch(u, {
        method: "HEAD",
        headers: { "User-Agent": BROWSER_HEADERS["User-Agent"] },
        signal: AbortSignal.timeout(5000),
        redirect: "follow",
      })
      if (res.ok && res.headers.get("content-type")?.startsWith("image")) {
        return u
      }
    } catch {
      // continue
    }
  }
  return null
}

async function getRolexCdnImages(reference: string): Promise<RolexImage[]> {
  const candidates = buildCdnUrls(reference)
  const results = await Promise.all(candidates.map(probeImageUrl))
  const seen = new Set<string>()
  const images: RolexImage[] = []

  for (const url of results) {
    if (!url || seen.has(url)) continue
    seen.add(url)
    const highRes = upgradeToHighRes(url)
    const thumb = highRes.replace(/c_limit,w_\d+/, "c_limit,w_640")
    images.push({ url: highRes, thumbnail: thumb, source: "rolex.com" })
  }
  return images
}

async function scrapeRolexImages(url: string, reference?: string): Promise<RolexImage[]> {
  let res: Response
  try {
    res = await fetch(url, { headers: BROWSER_HEADERS, signal: AbortSignal.timeout(20000) })
  } catch {
    // Network error — fall back to CDN probing
    if (reference) return getRolexCdnImages(reference)
    return []
  }

  if (!res.ok) {
    // 403 or other HTTP error — fall back to CDN probing instead of failing
    if (reference) return getRolexCdnImages(reference)
    return []
  }

  const html = await res.text()
  const $ = cheerio.load(html)

  // Extract all media.rolex.com image URLs from the HTML
  const allUrls = new Set<string>()

  // 1. From img src and data-src
  $("img").each((_, el) => {
    const src = $(el).attr("src") || ""
    const dataSrc = $(el).attr("data-src") || ""
    for (const u of [src, dataSrc]) {
      if (u.includes("media.rolex.com") && isProductImage(u, reference)) {
        allUrls.add(u)
      }
    }
  })

  // 2. From srcset on img and source elements
  $("img[srcset], source[srcset]").each((_, el) => {
    const srcset = $(el).attr("srcset") || ""
    srcset.split(",").forEach((s) => {
      const u = s.trim().split(/\s+/)[0]
      if (u && u.includes("media.rolex.com") && isProductImage(u, reference)) {
        allUrls.add(u)
      }
    })
  })

  // 3. From og:image and other meta tags
  $("meta[property='og:image'], meta[name='twitter:image']").each((_, el) => {
    const content = $(el).attr("content") || ""
    if (content.includes("media.rolex.com") && isProductImage(content, reference)) {
      allUrls.add(content)
    }
  })

  // 4. Regex scan the raw HTML for any media.rolex.com URLs we missed
  const urlRegex = /https?:\/\/media\.rolex\.com\/image\/upload[^"'\s)}\]]+/g
  let match
  while ((match = urlRegex.exec(html)) !== null) {
    const u = match[0]
    if (isProductImage(u, reference)) {
      allUrls.add(u)
    }
  }

  // If scrape found nothing but we have a reference, try CDN probing
  if (allUrls.size === 0 && reference) {
    return getRolexCdnImages(reference)
  }

  // Deduplicate by base path (same image at different sizes)
  const seen = new Map<string, string>()
  for (const u of allUrls) {
    const base = u.replace(/c_limit,w_\d+/, "").replace(/q_auto[^/]*/, "")
    if (!seen.has(base)) {
      seen.set(base, upgradeToHighRes(u))
    }
  }

  const images: RolexImage[] = []
  for (const [, highResUrl] of seen) {
    const thumb = highResUrl.replace(/c_limit,w_\d+/, "c_limit,w_640")
    images.push({
      url: highResUrl,
      thumbnail: thumb,
      source: "rolex.com",
    })
  }

  return images
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { reference, url: directUrl, collection } = body

    if (!reference && !directUrl) {
      return NextResponse.json({ error: "reference or url is required" }, { status: 400 })
    }

    let targetUrl: string
    let normalizedRef: string | undefined

    if (directUrl) {
      targetUrl = directUrl
      const refMatch = directUrl.match(/(m\d+[a-z]*-\d+)/i)
      normalizedRef = refMatch ? refMatch[1].toLowerCase() : undefined
    } else {
      normalizedRef = normalizeReference(reference)
      if (collection) {
        const colSlug = collection.toLowerCase().replace(/\s+/g, "-")
        targetUrl = `https://www.rolex.com/watches/${colSlug}/${normalizedRef}`
      } else {
        targetUrl = `https://www.rolex.com/watches/configure/${normalizedRef}`
      }
    }

    let images = await scrapeRolexImages(targetUrl, normalizedRef)

    // If no results and no direct URL, try common collections
    if (images.length === 0 && !directUrl && normalizedRef) {
      const collections = [
        "submariner", "datejust", "gmt-master-ii", "cosmograph-daytona",
        "day-date", "sky-dweller", "sea-dweller", "explorer",
        "yacht-master", "air-king", "oyster-perpetual", "1908",
      ]
      for (const col of collections) {
        const colUrl = `https://www.rolex.com/watches/${col}/${normalizedRef}`
        images = await scrapeRolexImages(colUrl, normalizedRef)
        if (images.length > 0) {
          return NextResponse.json({
            images,
            reference: normalizedRef,
            url: colUrl,
            total: images.length,
          })
        }
      }
    }

    return NextResponse.json({
      images,
      reference: normalizedRef,
      url: targetUrl,
      total: images.length,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Scrape failed: ${error.message}` },
      { status: 500 }
    )
  }
}
