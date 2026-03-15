import { NextRequest, NextResponse } from "next/server"
import puppeteer from "puppeteer-core"

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

function getChromePath(): string {
  if (process.platform === "win32") {
    return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  }
  if (process.platform === "darwin") {
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  }
  return "/usr/bin/google-chrome"
}

function isProductImage(url: string, reference?: string): boolean {
  if (!url || !url.includes("media.rolex.com")) return false
  // Skip navigation, footer, UI chrome images
  if (url.includes("/navigation/")) return false
  if (url.includes("/footer/")) return false
  if (url.includes("/new-watches/")) return false
  if (url.includes("family-collection")) return false
  if (url.includes("main-navigation")) return false
  // Skip animation sprite frames (bracelet rotation etc.) — they are tiny frames
  if (url.includes("anim-bracelet-material")) return false
  if (url.includes("anim-") && /--\d{3,}/.test(url)) return false
  // Skip generic backgrounds that aren't watch-specific
  if (url.includes("/bg/feature/feature-") && !reference) return false
  if (url.includes("/bg/model-cover-background")) return false
  // Must be from the catalogue or have the reference in URL
  const isCatalogue = url.includes("/catalogue/")
  const hasRef = reference ? url.includes(reference) : false
  return isCatalogue || hasRef
}

function upgradeToHighRes(url: string): string {
  // Replace size limits with larger ones for high-res
  return url
    .replace(/c_limit,w_\d+/, "c_limit,w_2560")
    .replace(/c_limit,w_320/, "c_limit,w_2560")
    .replace(/c_limit,w_640/, "c_limit,w_2560")
    .replace(/c_limit,w_800/, "c_limit,w_2560")
}

async function scrapeRolexImages(url: string, reference?: string): Promise<RolexImage[]> {
  let browser
  try {
    browser = await puppeteer.launch({
      executablePath: getChromePath(),
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
        "--window-size=1920,1080",
      ],
    })

    const page = await browser.newPage()
    await page.setViewport({ width: 1920, height: 1080 })
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    )
    // Hide webdriver flag
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => false })
    })

    // Collect image URLs from network responses
    const networkImages = new Set<string>()
    page.on("response", (resp) => {
      const ct = resp.headers()["content-type"] || ""
      const reqUrl = resp.url()
      if (ct.includes("image/") && reqUrl.includes("media.rolex.com")) {
        networkImages.add(reqUrl)
      }
    })

    await page.goto(url, { waitUntil: "networkidle2", timeout: 45000 })

    // Scroll down to trigger lazy-loaded images
    for (let y = 500; y <= 5000; y += 500) {
      await page.evaluate((scrollY) => window.scrollBy(0, scrollY), 500)
      await new Promise((r) => setTimeout(r, 800))
    }
    // Wait for images to finish loading
    await new Promise((r) => setTimeout(r, 2000))

    // Extract all img src from DOM
    const domImages = await page.evaluate(() => {
      const urls: string[] = []
      document.querySelectorAll("img").forEach((img) => {
        if (img.src && img.src.includes("media.rolex.com")) urls.push(img.src)
      })
      // Also check srcset
      document.querySelectorAll("img[srcset], source[srcset]").forEach((el) => {
        const srcset = (el as HTMLImageElement).srcset || ""
        srcset.split(",").forEach((s) => {
          const u = s.trim().split(/\s+/)[0]
          if (u && u.includes("media.rolex.com")) urls.push(u)
        })
      })
      return urls
    })

    await browser.close()
    browser = null

    // Combine all image URLs
    const allUrls = new Set<string>()
    for (const u of [...networkImages, ...domImages]) {
      if (isProductImage(u, reference)) {
        allUrls.add(u)
      }
    }

    // Deduplicate by base path (same image at different sizes)
    const seen = new Map<string, string>() // base -> best URL
    for (const u of allUrls) {
      // Extract base path: everything after the size/transform params
      const base = u.replace(/c_limit,w_\d+/, "").replace(/q_auto[^/]*/, "")
      if (!seen.has(base)) {
        seen.set(base, upgradeToHighRes(u))
      }
    }

    const images: RolexImage[] = []
    for (const [, highResUrl] of seen) {
      // Create a reasonable thumbnail (640px wide)
      const thumb = highResUrl.replace(/c_limit,w_\d+/, "c_limit,w_640")
      images.push({
        url: highResUrl,
        thumbnail: thumb,
        source: "rolex.com",
      })
    }

    return images
  } catch (err: any) {
    if (browser) await browser.close()
    throw err
  }
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
      // Try to extract reference from URL
      const refMatch = directUrl.match(/(m\d+[a-z]*-\d+)/i)
      normalizedRef = refMatch ? refMatch[1].toLowerCase() : undefined
    } else {
      normalizedRef = normalizeReference(reference)
      if (collection) {
        const colSlug = collection.toLowerCase().replace(/\s+/g, "-")
        targetUrl = `https://www.rolex.com/watches/${colSlug}/${normalizedRef}`
      } else {
        // Need to find the right collection - try configure page first
        targetUrl = `https://www.rolex.com/watches/configure/${normalizedRef}`
      }
    }

    let images = await scrapeRolexImages(targetUrl, normalizedRef)

    // If configure page had no product images and no direct URL, try common collections
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
