import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"
import { processAndUploadImage, isSupabaseUrl } from "@/lib/image-processing"

export const maxDuration = 120
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const admin = createAdminClient()
    if (!admin) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
    }

    const body = await req.json().catch(() => ({}))
    const batchSize = body.batchSize || 5

    // Find image rows that still point to external URLs
    const { data: rows, error } = await admin
      .from("watch_images")
      .select("id, watch_id, url, position")
      .not("url", "ilike", "%supabase.co%")
      .limit(batchSize)

    if (error) throw error
    if (!rows || rows.length === 0) {
      // Count total to confirm we're done
      const { count } = await admin
        .from("watch_images")
        .select("id", { count: "exact", head: true })
        .not("url", "ilike", "%supabase.co%")

      return NextResponse.json({
        processed: 0,
        failed: 0,
        remaining: count || 0,
        message: "No external images to migrate",
      })
    }

    let processed = 0
    let failed = 0
    const errors: Array<{ watchId: string; url: string; error: string }> = []

    for (const row of rows) {
      if (isSupabaseUrl(row.url)) {
        processed++
        continue
      }

      try {
        const result = await processAndUploadImage(
          row.url,
          row.watch_id,
          row.position
        )

        const { error: updateError } = await admin
          .from("watch_images")
          .update({
            url: result.url,
            url_thumb: result.url_thumb,
            url_optimized: result.url_optimized,
            source: "processed",
          })
          .eq("id", row.id)

        if (updateError) throw updateError
        processed++
      } catch (err: any) {
        failed++
        errors.push({
          watchId: row.watch_id,
          url: row.url,
          error: err.message,
        })
      }
    }

    // Count remaining
    const { count: remaining } = await admin
      .from("watch_images")
      .select("id", { count: "exact", head: true })
      .not("url", "ilike", "%supabase.co%")

    return NextResponse.json({
      processed,
      failed,
      remaining: remaining || 0,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
