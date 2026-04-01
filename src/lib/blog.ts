import { supabase, createAdminClient } from "./supabase"

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  cover_image: string | null
  category: string
  tags: string[]
  author: string
  status: "draft" | "published"
  seo_title: string | null
  seo_description: string | null
  reading_time: number
  featured: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export type BlogPostInput = Omit<BlogPost, "id" | "created_at" | "updated_at">

function calculateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "")
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

// Public reads (uses anon key with RLS)
export async function getBlogPosts(options?: {
  category?: string
  featured?: boolean
  limit?: number
  offset?: number
}): Promise<{ posts: BlogPost[]; total: number }> {
  if (!supabase) return { posts: [], total: 0 }

  let query = supabase
    .from("blog_posts")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false })

  if (options?.category) query = query.eq("category", options.category)
  if (options?.featured) query = query.eq("featured", true)
  if (options?.limit) query = query.limit(options.limit)
  if (options?.offset) query = query.range(options.offset, options.offset + (options.limit || 12) - 1)

  const { data, error, count } = await query
  if (error) return { posts: [], total: 0 }
  return { posts: (data || []) as BlogPost[], total: count || 0 }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  if (!supabase) return null

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (error) return null
  return data as BlogPost
}

export async function getRelatedPosts(postId: string, category: string, limit = 3): Promise<BlogPost[]> {
  if (!supabase) return []

  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .eq("category", category)
    .neq("id", postId)
    .order("published_at", { ascending: false })
    .limit(limit)

  return (data || []) as BlogPost[]
}

// Admin operations (uses service role key, bypasses RLS)
export async function getAllBlogPosts(status?: string): Promise<BlogPost[]> {
  const admin = createAdminClient()
  if (!admin) return []

  let query = admin
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false })

  if (status && status !== "all") query = query.eq("status", status)

  const { data, error } = await query
  if (error) return []
  return (data || []) as BlogPost[]
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const admin = createAdminClient()
  if (!admin) return null

  const { data, error } = await admin
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single()

  if (error) return null
  return data as BlogPost
}

export async function createBlogPost(input: Partial<BlogPostInput>): Promise<BlogPost> {
  const admin = createAdminClient()
  if (!admin) throw new Error("Admin client not available")

  const slug = input.slug || generateSlug(input.title || "untitled")
  const reading_time = calculateReadingTime(input.content || "")

  const { data, error } = await admin
    .from("blog_posts")
    .insert({
      title: input.title || "Untitled",
      slug,
      content: input.content || "",
      excerpt: input.excerpt || null,
      cover_image: input.cover_image || null,
      category: input.category || "news",
      tags: input.tags || [],
      author: input.author || "Golden Planet Watches",
      status: input.status || "draft",
      seo_title: input.seo_title || null,
      seo_description: input.seo_description || null,
      reading_time,
      featured: input.featured || false,
      published_at: input.status === "published" ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (error) throw error
  return data as BlogPost
}

export async function updateBlogPost(id: string, input: Partial<BlogPostInput>): Promise<BlogPost> {
  const admin = createAdminClient()
  if (!admin) throw new Error("Admin client not available")

  const updates: Record<string, unknown> = { ...input, updated_at: new Date().toISOString() }

  if (input.content) {
    updates.reading_time = calculateReadingTime(input.content)
  }
  if (input.title && !input.slug) {
    updates.slug = generateSlug(input.title)
  }
  if (input.status === "published" && !input.published_at) {
    updates.published_at = new Date().toISOString()
  }

  const { data, error } = await admin
    .from("blog_posts")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data as BlogPost
}

export async function deleteBlogPost(id: string): Promise<void> {
  const admin = createAdminClient()
  if (!admin) throw new Error("Admin client not available")

  const { error } = await admin.from("blog_posts").delete().eq("id", id)
  if (error) throw error
}

export const BLOG_CATEGORIES = [
  { value: "guides", label: "Guides" },
  { value: "news", label: "News" },
  { value: "brand-spotlight", label: "Brand Spotlight" },
  { value: "buying-tips", label: "Buying Tips" },
  { value: "market-insights", label: "Market Insights" },
] as const
