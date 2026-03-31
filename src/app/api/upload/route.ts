import { NextRequest, NextResponse } from "next/server"
import sharp from "sharp"
import { createAdminClient } from "@/lib/supabase"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const BUCKET = "watch-images"

function getPublicUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`
}

export async function POST(req: NextRequest) {
  try {
    const admin = createAdminClient()
    if (!admin) {
      return NextResponse.json({ error: "Storage not configured" }, { status: 500 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const watchId = formData.get("watchId") as string || "temp"
    const position = formData.get("position") as string || String(Date.now())

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 })
    }

    const rawBuffer = Buffer.from(await file.arrayBuffer())
    const basePath = `watches/${watchId}`
    const slug = `${position}-${Date.now()}`

    // Process variants sequentially to avoid memory spikes
    // Original: full quality, no resize
    const original = await sharp(rawBuffer)
      .webp({ quality: 100, nearLossless: true })
      .toBuffer()

    const thumb = await sharp(rawBuffer)
      .resize({ width: 400, withoutEnlargement: true })
      .webp({ quality: 60 })
      .toBuffer()

    const paths = {
      original: `${basePath}/${slug}-original.webp`,
      thumb: `${basePath}/${slug}-thumb.webp`,
    }

    // Upload original + thumb
    for (const [key, data] of [
      ["original", original],
      ["thumb", thumb],
    ] as const) {
      const { error } = await admin.storage.from(BUCKET).upload(
        paths[key as keyof typeof paths],
        data,
        { contentType: "image/webp", upsert: true }
      )
      if (error) {
        return NextResponse.json({ error: `Upload ${key} failed: ${error.message}` }, { status: 500 })
      }
    }

    const originalUrl = getPublicUrl(paths.original)
    return NextResponse.json({
      url: originalUrl,
      url_thumb: getPublicUrl(paths.thumb),
      url_optimized: originalUrl,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
