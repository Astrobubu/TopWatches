import { NextRequest, NextResponse } from "next/server"
import * as cheerio from "cheerio"

interface WatchSpecs {
  movement: string
  caseMaterial: string
  caseSize: string
  waterResistance: string
  dialColor: string
  bracelet: string
  powerReserve: string
  year: number
}

interface SearchResult {
  brand: string
  model: string
  reference: string
  description: string
  specs: Partial<WatchSpecs>
  source: string
}

// Known brand → Watchbase URL slug mappings
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
  "a. lange & sohne": "a-lange-and-sohne",
  "a. lange & söhne": "a-lange-and-sohne",
  zenith: "zenith",
  "grand seiko": "grand-seiko",
  seiko: "seiko",
  longines: "longines",
  tissot: "tissot",
  "blancpain": "blancpain",
  "girard-perregaux": "girard-perregaux",
  chopard: "chopard",
  piaget: "piaget",
  bulgari: "bulgari",
  bvlgari: "bulgari",
  "richard mille": "richard-mille",
}

// Known model/collection slugs per brand
const COLLECTION_SLUGS: Record<string, Record<string, string>> = {
  rolex: {
    submariner: "submariner",
    "submariner date": "submariner",
    datejust: "datejust",
    "gmt-master": "gmt-master-ii",
    "gmt-master ii": "gmt-master-ii",
    "gmt master ii": "gmt-master-ii",
    daytona: "daytona",
    "cosmograph daytona": "daytona",
    "day-date": "day-date",
    "sea-dweller": "sea-dweller",
    "sky-dweller": "sky-dweller",
    explorer: "explorer",
    "explorer ii": "explorer-ii",
    milgauss: "milgauss",
    "yacht-master": "yacht-master",
    "yacht-master ii": "yacht-master-ii",
    "air-king": "air-king",
    cellini: "cellini",
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
    gondolo: "gondolo",
  },
  "audemars-piguet": {
    "royal oak": "royal-oak",
    "royal oak offshore": "royal-oak-offshore",
  },
  cartier: {
    santos: "santos",
    tank: "tank",
    ballon: "ballon-bleu",
    pasha: "pasha",
    panthere: "panthere",
  },
  "tag-heuer": {
    carrera: "carrera",
    monaco: "monaco",
    aquaracer: "aquaracer",
    formula: "formula-1",
  },
  iwc: {
    portugieser: "portugieser",
    "big pilot": "big-pilots-watch",
    "pilot": "pilots-watch",
    portofino: "portofino",
  },
}

function parseQuery(query: string): { brand: string; collection: string; reference: string } {
  const q = query.trim().toLowerCase()

  // Try to extract reference number (usually at the end, contains digits and possibly letters/dashes)
  const refMatch = q.match(/\b([a-z]?\d[\w\-\.\/]+)\s*$/i) || q.match(/\b(\d{4,}[\w\-\.]*)\b/i)
  const reference = refMatch ? refMatch[1] : ""

  // Remove reference from query to find brand + collection
  const withoutRef = reference ? q.replace(reference, "").trim() : q

  // Find brand
  let detectedBrand = ""
  let brandSlug = ""
  for (const [name, slug] of Object.entries(BRAND_SLUGS)) {
    if (withoutRef.includes(name) || q.includes(name)) {
      detectedBrand = name
      brandSlug = slug
      break
    }
  }

  // Find collection
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

async function fetchWatchbasePage(url: string): Promise<SearchResult | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    })

    if (!res.ok) return null

    const html = await res.text()
    const $ = cheerio.load(html)

    // Extract from page title: "Brand - Reference Model Material / Color"
    const h1 = $("h1").first().text().trim()
    if (!h1) return null

    const specs: Partial<WatchSpecs> = {}

    // Watchbase uses definition lists and table-like structures
    // Try multiple selector patterns
    const specSelectors = [
      "tr",
      "dl dt",
      ".spec-row",
      "li",
      "div.row",
    ]

    const textContent = html.toLowerCase()

    // Extract specs from text patterns
    const extractSpec = (patterns: string[], content: string): string => {
      for (const pattern of patterns) {
        // Look for "label: value" or "label value" patterns in the page text
        const regex = new RegExp(`${pattern}[:\\s]+([^\\n<]+)`, "i")
        const match = content.match(regex)
        if (match) return match[1].trim()
      }
      return ""
    }

    // Extract specs from the full page text using "Label: Value" patterns
    // Watchbase uses a format like "Diameter: 43.00 mm", "W/R: 1220.00 m", etc.
    const bodyText = $("body").text()

    // Diameter / case size
    const diameterMatch = bodyText.match(/Diameter[:\s]+(\d+\.?\d*\s*mm)/i)
    if (diameterMatch) specs.caseSize = diameterMatch[1]

    // Water resistance (W/R or Water Resistance)
    const wrMatch2 = bodyText.match(/(?:W\/R|Water Resistance)[:\s]+(\d+\.?\d*)\s*(m|meters|metres|atm|bar|ft)/i)
    if (wrMatch2) specs.waterResistance = wrMatch2[1] + " " + wrMatch2[2]

    // Caliber / Movement
    const caliberMatch = bodyText.match(/(?:Caliber|Calibre|Movement)[:\s]+([^\n]{3,60}?)(?:\n|Hours|$)/i)
    if (caliberMatch) specs.movement = caliberMatch[1].trim()
    // Also try: "Rolex caliber XXXX" pattern in description
    if (!specs.movement) {
      const calMatch2 = bodyText.match(/(?:caliber|calibre)\s+(\d[\w\s\-]+?)(?:\n|$)/i)
      if (calMatch2) specs.movement = calMatch2[1].trim()
    }

    // Dial color
    const colorMatch = bodyText.match(/Color[:\s]+(\w[\w\s]*?)(?:\n|Finish|$)/i)
    if (colorMatch && colorMatch[1].trim().length < 30) specs.dialColor = colorMatch[1].trim()

    // Bracelet / Strap materials
    const braceletMatMatch = bodyText.match(/(?:Bracelet|Strap)\s*(?:Material)?[:\s]+((?:Stainless Steel|Leather|Rubber|Titanium|Gold|Alligator|Nato|Canvas|Textile|Metal|Ceramic|Oyster|Jubilee|President)[\w\s,]*)/i)
    if (braceletMatMatch) specs.bracelet = braceletMatMatch[1].trim()

    // Power reserve
    const prMatch = bodyText.match(/(?:Power Reserve)[:\s]+(\d+\.?\d*\s*(?:hours|h|hrs))/i)
    if (prMatch) specs.powerReserve = prMatch[1]

    // Fallback: try simpler patterns from HTML
    if (!specs.caseSize) {
      const sizeMatch = html.match(/(\d{2,3}\.?\d*)\s*mm/i)
      if (sizeMatch) specs.caseSize = sizeMatch[1] + "mm"
    }
    if (!specs.waterResistance) {
      const wrMatch = html.match(/water\s*resistance[:\s]*(\d+\.?\d*)\s*(m|meters)/i)
      if (wrMatch) specs.waterResistance = wrMatch[1] + wrMatch[2]
    }

    // Extract brand, reference, model from h1
    // H1 format: "Brand - Reference Model Material / Color"
    const h1Parts = h1.split(" - ")
    const brand = h1Parts[0]?.trim() || ""
    const afterBrand = h1Parts.slice(1).join(" - ").trim()
    // Reference is typically the first token (e.g. "126603-0001")
    const refMatch2 = afterBrand.match(/^([\w\-\.\/]+)/)
    const reference = refMatch2 ? refMatch2[1] : ""
    // Model is the next word(s) before material/color info
    const afterRef = afterBrand.replace(reference, "").trim()
    const model = afterRef.split(/\s+(?:Stainless|Steel|Yellow|Rose|White|Gold|Platinum|Titanium|Ceramic|Carbon)/i)[0]?.trim() || afterRef.split("/")[0]?.trim() || ""

    // Extract from breadcrumb ol if available
    const breadcrumbItems = $("ol li, .breadcrumb li")
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((t) => t.length > 1 && t.length < 100)

    const metaDesc = $("meta[name='description']").attr("content") || ""
    const pageText = $("body").text().replace(/\s+/g, " ").substring(0, 500)

    // Try to find case material
    const materialPatterns = [
      /(?:stainless steel|steel|yellow gold|rose gold|white gold|platinum|titanium|ceramic|carbon)/gi,
    ]
    for (const p of materialPatterns) {
      const materials = pageText.match(p)
      if (materials && !specs.caseMaterial) {
        specs.caseMaterial = [...new Set(materials.map((m) => m.trim()))].join(" and ")
      }
    }

    // Try to extract year
    const yearMatch = pageText.match(/(?:introduced|year|production)[:\s]*(\d{4})/i) ||
      pageText.match(/\b(20[12]\d)\b/)
    if (yearMatch) specs.year = parseInt(yearMatch[1])

    // Validate: reject results that don't look like real watch data
    if (!brand || brand.length > 50 || !specs.caseSize) return null

    return {
      brand,
      model,
      reference,
      description: metaDesc || `${brand} ${model} ${reference}`.trim(),
      specs,
      source: "watchbase",
    }
  } catch {
    return null
  }
}

async function searchWatchbase(query: string): Promise<SearchResult | null> {
  const parsed = parseQuery(query)

  // Strategy 1: Direct URL if we can construct it
  if (parsed.brand && parsed.reference) {
    // Try with collection
    if (parsed.collection) {
      const url = `https://watchbase.com/${parsed.brand}/${parsed.collection}/${parsed.reference}`
      const result = await fetchWatchbasePage(url)
      if (result) return result
    }

    // Try reference directly under brand (Watchbase sometimes works this way)
    const url = `https://watchbase.com/${parsed.brand}/${parsed.reference}`
    const result = await fetchWatchbasePage(url)
    if (result) return result
  }

  // Strategy 2: Try just the reference number as a path under common collections
  if (parsed.brand && parsed.reference) {
    const collections = COLLECTION_SLUGS[parsed.brand]
    if (collections) {
      for (const slug of Object.values(collections)) {
        const url = `https://watchbase.com/${parsed.brand}/${slug}/${parsed.reference}`
        const result = await fetchWatchbasePage(url)
        if (result) return result
      }
    }
  }

  // Strategy 3: Try the Watchbase search page (may work with some queries)
  try {
    const searchUrl = `https://watchbase.com/search?q=${encodeURIComponent(query)}`
    const res = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    })

    if (res.ok) {
      const html = await res.text()
      const $ = cheerio.load(html)

      // Find first link to a watch detail page
      const link = $("a[href*='watchbase.com/']")
        .filter((_, el) => {
          const href = $(el).attr("href") || ""
          // Match URLs with at least 3 path segments (brand/collection/ref)
          const parts = href.replace("https://watchbase.com/", "").split("/").filter(Boolean)
          return parts.length >= 2
        })
        .first()
        .attr("href")

      if (link) {
        const result = await fetchWatchbasePage(link)
        if (result) return result
      }
    }
  } catch {
    // ignore search failures
  }

  return null
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "query is required" }, { status: 400 })
    }

    const result = await searchWatchbase(query)

    if (!result) {
      return NextResponse.json(
        {
          error:
            "No results found. Try including the brand name and reference (e.g., 'Rolex Submariner 126610LN').",
        },
        { status: 404 }
      )
    }

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
