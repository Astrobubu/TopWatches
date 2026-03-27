import sharp from "sharp"
import { createAdminClient } from "./supabase"

const BROWSER_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://www.google.com/",
}

export interface ProcessedImage {
  url: string
  url_thumb: string
  url_optimized: string
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const BUCKET = "watch-images"

function getPublicUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`
}

async function downloadImage(sourceUrl: string): Promise<Buffer> {
  const res = await fetch(sourceUrl, {
    headers: BROWSER_HEADERS,
    signal: AbortSignal.timeout(30000),
  })

  if (!res.ok) {
    throw new Error(`Download failed: ${res.status} ${res.statusText}`)
  }

  const contentType = res.headers.get("content-type") || ""
  if (!contentType.startsWith("image/") && !contentType.includes("octet-stream")) {
    throw new Error(`Not an image: ${contentType}`)
  }

  const arrayBuffer = await res.arrayBuffer()
  if (arrayBuffer.byteLength === 0) {
    throw new Error("Empty image")
  }
  if (arrayBuffer.byteLength > 20 * 1024 * 1024) {
    throw new Error("Image too large (>20MB)")
  }

  return Buffer.from(arrayBuffer)
}

async function uploadToStorage(
  admin: ReturnType<typeof createAdminClient>,
  path: string,
  data: Buffer,
  contentType: string
): Promise<void> {
  const { error } = await admin!.storage.from(BUCKET).upload(path, data, {
    contentType,
    upsert: true,
  })
  if (error) throw new Error(`Upload failed for ${path}: ${error.message}`)
}

export async function processAndUploadImage(
  sourceUrl: string,
  watchId: string,
  position: number
): Promise<ProcessedImage> {
  const admin = createAdminClient()
  if (!admin) throw new Error("Supabase not configured")

  // Download
  const rawBuffer = await downloadImage(sourceUrl)

  // Process three variants
  const [original, optimized, thumb] = await Promise.all([
    sharp(rawBuffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer(),
    sharp(rawBuffer)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 70 })
      .toBuffer(),
    sharp(rawBuffer)
      .resize({ width: 400, withoutEnlargement: true })
      .webp({ quality: 60 })
      .toBuffer(),
  ])

  // Upload all three
  const basePath = `watches/${watchId}`
  const paths = {
    original: `${basePath}/${position}-original.webp`,
    optimized: `${basePath}/${position}-optimized.webp`,
    thumb: `${basePath}/${position}-thumb.webp`,
  }

  await Promise.all([
    uploadToStorage(admin, paths.original, original, "image/webp"),
    uploadToStorage(admin, paths.optimized, optimized, "image/webp"),
    uploadToStorage(admin, paths.thumb, thumb, "image/webp"),
  ])

  return {
    url: getPublicUrl(paths.original),
    url_thumb: getPublicUrl(paths.thumb),
    url_optimized: getPublicUrl(paths.optimized),
  }
}

export function isSupabaseUrl(url: string): boolean {
  return url.includes("supabase.co/storage")
}
