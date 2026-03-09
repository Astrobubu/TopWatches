import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"
import { gpStock } from "@/data/gp-stock"

export async function POST() {
  try {
    const admin = createAdminClient()
    if (!admin) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
    }

    // Clear all existing data
    const { error: delImgErr } = await admin.from("watch_images").delete().gte("created_at", "1970-01-01")
    if (delImgErr) console.error("Delete images error:", delImgErr)

    const { error: delWatchErr } = await admin.from("watches").delete().gte("created_at", "1970-01-01")
    if (delWatchErr) console.error("Delete watches error:", delWatchErr)

    let inserted = 0
    const errors: string[] = []

    // Insert in batches of 20 for efficiency
    const batchSize = 20
    for (let i = 0; i < gpStock.length; i += batchSize) {
      const batch = gpStock.slice(i, i + batchSize)
      const rows = batch.map((watch) => ({
        id: watch.id,
        brand: watch.brand,
        model: watch.model,
        reference: watch.reference,
        price: watch.price,
        description: watch.description,
        specs: watch.specs,
        category: watch.category,
        condition: watch.condition,
        featured: watch.featured,
      }))

      const { error: batchError } = await admin.from("watches").insert(rows)
      if (batchError) {
        errors.push(`Batch ${i / batchSize + 1}: ${batchError.message}`)
        // Fallback: try one by one
        for (const row of rows) {
          const { error: singleError } = await admin.from("watches").upsert(row, { onConflict: "id" })
          if (singleError) {
            errors.push(`${row.id}: ${singleError.message}`)
          } else {
            inserted++
          }
        }
      } else {
        inserted += batch.length
      }
    }

    return NextResponse.json({
      message: `Cleared database and seeded ${inserted}/${gpStock.length} watches from GP Stock`,
      seeded: true,
      count: inserted,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
