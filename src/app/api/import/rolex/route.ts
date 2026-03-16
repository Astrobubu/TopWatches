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

async function scrapeRolexImages(url: string, reference?: string): Promise<RolexImage[]> {
  const res = await fetch(url, { headers: BROWSER_HEADERS, signal: AbortSignal.timeout(20000) })

  if (!res.ok) {
    throw new Error(`Rolex returned status ${res.status}`)
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
