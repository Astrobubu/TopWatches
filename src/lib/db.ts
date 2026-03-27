import { createAdminClient, supabase } from "./supabase"
import type { Watch } from "./types"

// Transform DB row + images into the Watch type used by the frontend
function toWatch(row: any, images: any[]): Watch {
  return {
    id: row.id,
    brand: row.brand,
    model: row.model,
    reference: row.reference,
    price: Number(row.price),
    images: images
      .sort((a: any, b: any) => a.position - b.position)
      .map((img: any) => img.url),
    description: row.description || "",
    specs: row.specs || {},
    category: row.category,
    condition: row.condition,
    gender: row.gender || undefined,
    scope: row.scope || undefined,
    featured: row.featured,
  }
}

export async function getWatches(): Promise<Watch[]> {
  if (!supabase) return []

  const { data: watches, error } = await supabase
    .from("watches")
    .select("*, watch_images(*)")
    .order("created_at", { ascending: false })

  if (error) throw error
  if (!watches || watches.length === 0) return []

  return watches.map((w: any) => toWatch(w, w.watch_images || []))
}

export async function getWatch(id: string): Promise<Watch | null> {
  if (!supabase) return null

  const { data: watch, error } = await supabase
    .from("watches")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !watch) return null

  const { data: images } = await supabase
    .from("watch_images")
    .select("*")
    .eq("watch_id", id)

  return toWatch(watch, images || [])
}

export async function createWatch(
  watch: Omit<Watch, "images"> & { images: string[] }
): Promise<Watch> {
  const admin = createAdminClient()
  if (!admin) throw new Error("Supabase not configured")

  const { error: watchError } = await admin.from("watches").upsert({
    id: watch.id,
    brand: watch.brand,
    model: watch.model,
    reference: watch.reference,
    price: watch.price,
    description: watch.description,
    specs: watch.specs,
    category: watch.category,
    condition: watch.condition,
    gender: watch.gender || null,
    scope: watch.scope || null,
    featured: watch.featured,
  }, { onConflict: "id" })

  if (watchError) throw watchError

  // Clear existing images before inserting new ones (upsert scenario)
  await admin.from("watch_images").delete().eq("watch_id", watch.id)

  if (watch.images.length > 0) {
    const imageRows = watch.images.map((url, i) => ({
      watch_id: watch.id,
      url,
      source: "manual",
      position: i,
    }))
    const { error: imgError } = await admin.from("watch_images").insert(imageRows)
    if (imgError) throw imgError
  }

  const result = await getWatch(watch.id)
  if (!result) throw new Error("Failed to retrieve created watch")
  return result
}

export async function updateWatch(
  id: string,
  data: Partial<Omit<Watch, "images">> & { images?: string[] }
): Promise<Watch> {
  const admin = createAdminClient()
  if (!admin) throw new Error("Supabase not configured")

  const { images, ...watchData } = data

  if (Object.keys(watchData).length > 0) {
    const { error } = await admin.from("watches").update(watchData).eq("id", id)
    if (error) throw error
  }

  if (images) {
    await admin.from("watch_images").delete().eq("watch_id", id)
    if (images.length > 0) {
      const imageRows = images.map((url, i) => ({
        watch_id: id,
        url,
        source: "manual",
        position: i,
      }))
      const { error } = await admin.from("watch_images").insert(imageRows)
      if (error) throw error
    }
  }

  const result = await getWatch(id)
  if (!result) throw new Error("Watch not found after update")
  return result
}

export async function deleteWatch(id: string): Promise<void> {
  const admin = createAdminClient()
  if (!admin) throw new Error("Supabase not configured")
  const { error } = await admin.from("watches").delete().eq("id", id)
  if (error) throw error
}
