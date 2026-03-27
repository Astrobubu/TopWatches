import { NextRequest, NextResponse } from "next/server"
import { processAndUploadImage, isSupabaseUrl } from "@/lib/image-processing"

export const maxDuration = 60
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const { watchId, urls } = await req.json()

    if (!watchId || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: "watchId and urls[] are required" },
        { status: 400 }
      )
    }

    const results: Array<{
      original: string
      url: string
      url_thumb: string
      url_optimized: string
      error?: string
    }> = []

    // Process sequentially to avoid memory spikes
    for (let i = 0; i < urls.length; i++) {
      const sourceUrl = urls[i]

      // Skip already-hosted images
      if (isSupabaseUrl(sourceUrl)) {
        results.push({
          original: sourceUrl,
          url: sourceUrl,
          url_thumb: sourceUrl,
          url_optimized: sourceUrl,
        })
        continue
      }

      try {
        const processed = await processAndUploadImage(sourceUrl, watchId, i)
        results.push({
          original: sourceUrl,
          ...processed,
        })
      } catch (err: any) {
        results.push({
          original: sourceUrl,
          url: sourceUrl,
          url_thumb: sourceUrl,
          url_optimized: sourceUrl,
          error: err.message,
        })
      }
    }

    return NextResponse.json({ results })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
