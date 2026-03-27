import { supabase } from "./supabase"
import type { Watch } from "./types"
import { watches as staticWatches } from "@/data/watches"

// Transform DB row + images into the Watch type
function toWatch(row: any, images: any[]): Watch {
  const sorted = images.sort((a: any, b: any) => a.position - b.position)
  return {
    id: row.id,
    brand: row.brand,
    model: row.model,
    reference: row.reference,
    price: Number(row.price),
    images: sorted.map((img: any) => img.url),
    imageVariants: sorted.map((img: any) => ({
      url: img.url,
      url_thumb: img.url_thumb || undefined,
      url_optimized: img.url_optimized || undefined,
    })),
    description: row.description || "",
    specs: row.specs || {},
    category: row.category,
    condition: row.condition,
    gender: row.gender || undefined,
    scope: row.scope || undefined,
    featured: row.featured,
  }
}

// Fetches watches from Supabase, falls back to static data if DB is empty or errors
export async function getAllWatches(): Promise<Watch[]> {
  try {
    const { data: watches, error } = await supabase
      .from("watches")
      .select("*, watch_images(*)")
      .order("created_at", { ascending: false })

    if (error) throw error
    if (!watches || watches.length === 0) return staticWatches

    return watches.map((w: any) => toWatch(w, w.watch_images || []))
  } catch {
    // Fallback to static data if Supabase is unavailable
    return staticWatches
  }
}

export async function getWatchById(id: string): Promise<Watch | null> {
  try {
    const { data: watch, error } = await supabase
      .from("watches")
      .select("*")
      .eq("id", id)
      .single()

    if (error || !watch) {
      // Fallback to static
      return staticWatches.find((w) => w.id === id) || null
    }

    const { data: images } = await supabase
      .from("watch_images")
      .select("*")
      .eq("watch_id", id)

    return toWatch(watch, images || [])
  } catch {
    return staticWatches.find((w) => w.id === id) || null
  }
}
