import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"
import { processAndUploadImage, generateVariantsFromExisting, isSupabaseUrl } from "@/lib/image-processing"

export const maxDuration = 120
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const admin = createAdminClient()
    if (!admin) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
    }

    const body = await req.json().catch(() => ({}))
    const batchSize = body.batchSize || 3

    // Phase 1: external URLs that need full migration
    const { data: externalRows, error: extErr } = await admin
      .from("watch_images")
      .select("id, watch_id, url, position")
      .not("url", "ilike", "%supabase.co%")
      .limit(batchSize)

    if (extErr) throw extErr

    // Phase 2: Supabase images missing thumb/optimized variants
    const { data: missingRows, error: missErr } = await admin
      .from("watch_images")
      .select("id, watch_id, url, position")
      .ilike("url", "%supabase.co%")
      .is("url_thumb", null)
      .limit(batchSize)

    if (missErr) throw missErr

    const rows = [...(externalRows || []), ...(missingRows || [])]

    if (rows.length === 0) {
      const { count: extRemaining } = await admin
        .from("watch_images")
        .select("id", { count: "exact", head: true })
        .not("url", "ilike", "%supabase.co%")

      const { count: varRemaining } = await admin
        .from("watch_images")
        .select("id", { count: "exact", head: true })
        .ilike("url", "%supabase.co%")
        .is("url_thumb", null)

      return NextResponse.json({
        processed: 0,
        failed: 0,
        remaining: (extRemaining || 0) + (varRemaining || 0),
        message: "All images are fully processed",
      })
    }

    let processed = 0
    let failed = 0
    const errors: Array<{ watchId: string; url: string; error: string }> = []

    for (const row of rows) {
      try {
        let result

        if (isSupabaseUrl(row.url)) {
          // Already on Supabase — just generate missing variants
          result = await generateVariantsFromExisting(
            row.url,
            row.watch_id,
            row.position
          )
        } else {
          // External URL — full download + process
          result = await processAndUploadImage(
            row.url,
            row.watch_id,
            row.position
          )
        }

        const { error: updateError } = await admin
          .from("watch_images")
          .update({
            url: result.url,
            url_thumb: result.url_thumb,
            url_optimized: result.url,
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
    const { count: extLeft } = await admin
      .from("watch_images")
      .select("id", { count: "exact", head: true })
      .not("url", "ilike", "%supabase.co%")

    const { count: varLeft } = await admin
      .from("watch_images")
      .select("id", { count: "exact", head: true })
      .ilike("url", "%supabase.co%")
      .is("url_thumb", null)

    return NextResponse.json({
      processed,
      failed,
      remaining: (extLeft || 0) + (varLeft || 0),
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
