import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"
import { watches } from "@/data/watches"

export async function POST() {
  try {
    const admin = createAdminClient()
    if (!admin) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
    }

    // Check if watches already exist
    const { count } = await admin
      .from("watches")
      .select("*", { count: "exact", head: true })

    if (count && count > 0) {
      return NextResponse.json({
        message: `Database already has ${count} watches. Skipping seed.`,
        seeded: false,
      })
    }

    // Insert all watches
    for (const watch of watches) {
      const { images, ...watchData } = watch

      const { error: watchError } = await admin.from("watches").insert({
        id: watchData.id,
        brand: watchData.brand,
        model: watchData.model,
        reference: watchData.reference,
        price: watchData.price,
        description: watchData.description,
        specs: watchData.specs,
        category: watchData.category,
        condition: watchData.condition,
        featured: watchData.featured,
      })

      if (watchError) {
        console.error(`Failed to insert watch ${watchData.id}:`, watchError)
        continue
      }

      // Insert images
      if (images.length > 0) {
        const imageRows = images.map((url, i) => ({
          watch_id: watchData.id,
          url,
          source: "unsplash",
          position: i,
        }))

        const { error: imgError } = await admin.from("watch_images").insert(imageRows)
        if (imgError) {
          console.error(`Failed to insert images for ${watchData.id}:`, imgError)
        }
      }
    }

    return NextResponse.json({
      message: `Seeded ${watches.length} watches successfully`,
      seeded: true,
      count: watches.length,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
