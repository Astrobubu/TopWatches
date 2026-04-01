import { supabase, createAdminClient } from "./supabase"

export interface LocationPage {
  id: string
  area_name: string
  slug: string
  hero_image: string | null
  intro_text: string
  why_buy_here: string
  landmarks: { name: string; description: string; image?: string }[]
  faqs: { question: string; answer: string }[]
  map_embed: string | null
  nearby_areas: string[]
  seo_title: string | null
  seo_description: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export async function getLocationPages(): Promise<LocationPage[]> {
  if (!supabase) return []
  try {
    const { data, error } = await supabase
      .from("location_pages")
      .select("*")
      .eq("published", true)
      .order("area_name")
    if (error) return []
    return (data || []) as LocationPage[]
  } catch { return [] }
}

export async function getLocationPage(slug: string): Promise<LocationPage | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from("location_pages")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single()
    if (error) return null
    return data as LocationPage
  } catch { return null }
}

export async function getAllLocationPages(): Promise<LocationPage[]> {
  const admin = createAdminClient()
  if (!admin) return []
  const { data, error } = await admin
    .from("location_pages")
    .select("*")
    .order("area_name")
  if (error) return []
  return (data || []) as LocationPage[]
}

export async function createLocationPage(input: Partial<LocationPage>): Promise<LocationPage> {
  const admin = createAdminClient()
  if (!admin) throw new Error("Admin client not available")
  const { data, error } = await admin
    .from("location_pages")
    .insert(input)
    .select()
    .single()
  if (error) throw error
  return data as LocationPage
}

export async function updateLocationPage(id: string, input: Partial<LocationPage>): Promise<LocationPage> {
  const admin = createAdminClient()
  if (!admin) throw new Error("Admin client not available")
  const { data, error } = await admin
    .from("location_pages")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return data as LocationPage
}

export async function deleteLocationPage(id: string): Promise<void> {
  const admin = createAdminClient()
  if (!admin) throw new Error("Admin client not available")
  const { error } = await admin.from("location_pages").delete().eq("id", id)
  if (error) throw error
}
