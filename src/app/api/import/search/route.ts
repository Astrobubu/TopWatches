import { NextRequest, NextResponse } from "next/server"
import * as cheerio from "cheerio"

interface WatchSpecs {
  movement: string
  caseMaterial: string
  caseSize: string
  dialColor: string
  bracelet: string
  year: number
}

interface SearchResult {
  brand: string
  model: string
  reference: string
  description: string
  specs: Partial<WatchSpecs>
  source: string
  url?: string
  thumbnail?: string
}

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
}

function parseSpecsFromPage($: cheerio.CheerioAPI): Partial<WatchSpecs> {
  const specs: Partial<WatchSpecs> = {}
  const bodyText = $("body").text()

  const diameterMatch = bodyText.match(/Diameter[:\s]+(\d+\.?\d*\s*mm)/i)
  if (diameterMatch) specs.caseSize = diameterMatch[1]

  const caliberMatch = bodyText.match(/(?:Caliber|Calibre|Movement)[:\s]+([^\n]{3,60}?)(?:\n|Hours|$)/i)
  if (caliberMatch) specs.movement = caliberMatch[1].trim()
  if (!specs.movement) {
    const calMatch2 = bodyText.match(/(?:caliber|calibre)\s+(\d[\w\s\-]+?)(?:\n|$)/i)
    if (calMatch2) specs.movement = calMatch2[1].trim()
  }

  const colorMatch = bodyText.match(/Color[:\s]+(\w[\w\s]*?)(?:\n|Finish|$)/i)
  if (colorMatch && colorMatch[1].trim().length < 30) specs.dialColor = colorMatch[1].trim()

  const braceletMatch = bodyText.match(/(?:Bracelet|Strap)\s*(?:Material)?[:\s]+((?:Stainless Steel|Leather|Rubber|Titanium|Gold|Alligator|Nato|Canvas|Textile|Metal|Ceramic|Oyster|Jubilee|President)[\w\s,]*)/i)
  if (braceletMatch) specs.bracelet = braceletMatch[1].trim()

  if (!specs.caseSize) {
    const sizeMatch = bodyText.match(/(\d{2,3}\.?\d*)\s*mm/i)
    if (sizeMatch) specs.caseSize = sizeMatch[1] + "mm"
  }

  const pageText = $("body").text().replace(/\s+/g, " ").substring(0, 500)
  const materials = pageText.match(/(?:stainless steel|steel|yellow gold|rose gold|white gold|platinum|titanium|ceramic|carbon)/gi)
  if (materials && !specs.caseMaterial) {
    specs.caseMaterial = [...new Set(materials.map((m) => m.trim()))].join(" and ")
  }

  const yearMatch = pageText.match(/(?:introduced|year|production)[:\s]*(\d{4})/i) || pageText.match(/\b(20[12]\d)\b/)
  if (yearMatch) specs.year = parseInt(yearMatch[1])

  return specs
}

function parseWatchFromPage($: cheerio.CheerioAPI, url: string): SearchResult | null {
  const h1 = $("h1").first().text().trim()
  if (!h1) return null

  const specs = parseSpecsFromPage($)

  const h1Parts = h1.split(" - ")
  const brand = h1Parts[0]?.trim() || ""
  const afterBrand = h1Parts.slice(1).join(" - ").trim()
  const refMatch = afterBrand.match(/^([\w\-\.\/]+)/)
  const reference = refMatch ? refMatch[1] : ""
  const afterRef = afterBrand.replace(reference, "").trim()
  const model = afterRef.split(/\s+(?:Stainless|Steel|Yellow|Rose|White|Gold|Platinum|Titanium|Ceramic|Carbon)/i)[0]?.trim() || afterRef.split("/")[0]?.trim() || ""

  const metaDesc = $("meta[name='description']").attr("content") || ""

  if (!brand || brand.length > 50) return null

  return {
    brand,
    model,
    reference,
    description: metaDesc || `${brand} ${model} ${reference}`.trim(),
    specs,
    source: "watchbase",
    url,
  }
}

async function fetchAndParsePage(url: string): Promise<SearchResult | null> {
  try {
    const res = await fetch(url, { headers: FETCH_HEADERS, redirect: "follow" })
    if (!res.ok) return null
    const html = await res.text()
    const $ = cheerio.load(html)
    return parseWatchFromPage($, url)
  } catch {
    return null
  }
}

// Quick results from the Watchbase filter API (returns brand, model, ref, thumbnail)
interface QuickResult {
  brand: string
  model: string
  reference: string
  description: string
  url: string
  thumbnail: string
}

function parseFilterResults(html: string): QuickResult[] {
  const $ = cheerio.load(html)
  const results: QuickResult[] = []

  $("a.watch-block, a.item-block").each((_, el) => {
    const href = $(el).attr("href") || ""
    if (!href) return

    const brand = $(el).find(".toptext strong").text().trim()
    const familyText = $(el).find(".toptext").text().replace(brand, "").trim()
    const ref = $(el).find(".bottomtext strong").text().trim()
    const desc = $(el).find(".bottomtext").text().replace(ref, "").trim()
    const img = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || ""

    if (brand && ref) {
      results.push({
        brand,
        model: desc || familyText,
        reference: ref,
        description: `${brand} ${desc || familyText} (${ref})`.trim(),
        url: href.startsWith("http") ? href : `https://watchbase.com${href}`,
        thumbnail: img,
      })
    }
  })

  return results
}

function cleanQuery(query: string): string[] {
  const q = query.trim()
  const queries: string[] = [q]

  // Remove standalone generation markers like "2", "II", "III", "41" that aren't part of reference
  // e.g. "Rolex Datejust 2 126333-0013" -> "Rolex Datejust 126333-0013"
  const cleaned = q
    .replace(/\b(I{1,3}|IV|V|VI{0,3})\b/gi, "") // Roman numerals
    .replace(/\b(\d{1})\b(?!\d*-)/g, "") // Single digits not part of a reference (xxx-xxxx)
    .replace(/\s{2,}/g, " ")
    .trim()
  if (cleaned !== q && cleaned.length > 3) {
    queries.push(cleaned)
  }

  // Try just the reference number (last token that looks like a ref)
  const refMatch = q.match(/\b([a-z]?\d[\w\-\.\/]{3,})\s*$/i) || q.match(/\b(\d{4,}[\w\-\.]*)\b/i)
  if (refMatch) {
    queries.push(refMatch[1])
    // Also try brand + reference only
    const brand = q.split(/\s+/)[0]
    if (brand && brand.toLowerCase() !== refMatch[1].toLowerCase()) {
      queries.push(`${brand} ${refMatch[1]}`)
    }
  }

  // Dedupe while preserving order
  return [...new Set(queries)]
}

async function fetchFilterResults(query: string): Promise<QuickResult[]> {
  try {
    const filterUrl = `https://watchbase.com/filter/results?q=${encodeURIComponent(query)}&page=1`
    const res = await fetch(filterUrl, {
      headers: {
        ...FETCH_HEADERS,
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json, text/javascript, */*",
      },
    })

    if (res.ok) {
      const data = await res.json()
      return parseFilterResults(data.watchesHtml || "")
    }
  } catch {
    // ignore
  }
  return []
}

async function searchWatchbase(query: string): Promise<SearchResult[]> {
  const results: SearchResult[] = []
  const seenRefs = new Set<string>()

  // Try multiple query variations until we get results
  const queryVariants = cleanQuery(query)
  let quickResults: QuickResult[] = []

  for (const q of queryVariants) {
    quickResults = await fetchFilterResults(q)
    if (quickResults.length > 0) break
  }

  if (quickResults.length === 0) return results

  // Fetch full specs for up to 6 results in parallel
  const detailPromises = quickResults.slice(0, 6).map(async (qr) => {
    const detail = await fetchAndParsePage(qr.url)
    if (detail) {
      detail.thumbnail = qr.thumbnail
      return detail
    }
    // Fall back to quick result data if detail page fails
    return {
      brand: qr.brand,
      model: qr.model,
      reference: qr.reference,
      description: qr.description,
      specs: {},
      source: "watchbase",
      url: qr.url,
      thumbnail: qr.thumbnail,
    } as SearchResult
  })

  const detailResults = await Promise.all(detailPromises)
  for (const r of detailResults) {
    const key = r.reference.toLowerCase()
    if (!seenRefs.has(key)) {
      seenRefs.add(key)
      results.push(r)
    }
  }

  return results
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "query is required" }, { status: 400 })
    }

    const results = await searchWatchbase(query)

    if (results.length === 0) {
      return NextResponse.json(
        {
          error:
            "No results found. Try a different search term (e.g., 'Rolex Submariner' or 'Rolex 126610LN').",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({ results })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
