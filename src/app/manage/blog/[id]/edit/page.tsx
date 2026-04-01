"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { BlogEditor } from "@/components/blog/blog-editor"
import { BLOG_CATEGORIES, type BlogPost } from "@/lib/blog"
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react"
import Link from "next/link"

export default function EditBlogPostPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    cover_image: "",
    category: "news",
    tags: "",
    author: "Golden Planet Watches",
    status: "draft" as "draft" | "published",
    seo_title: "",
    seo_description: "",
    featured: false,
  })

  useEffect(() => {
    fetch(`/api/blog?status=all`)
      .then((r) => r.json())
      .then((posts: BlogPost[]) => {
        const post = posts.find((p) => p.id === id)
        if (post) {
          setForm({
            title: post.title,
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt || "",
            cover_image: post.cover_image || "",
            category: post.category,
            tags: post.tags?.join(", ") || "",
            author: post.author,
            status: post.status,
            seo_title: post.seo_title || "",
            seo_description: post.seo_description || "",
            featured: post.featured,
          })
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave(publishStatus?: "draft" | "published") {
    setSaving(true)
    try {
      const status = publishStatus || form.status
      const res = await fetch("/api/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          ...form,
          status,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      })
      if (res.ok) {
        router.push("/manage/blog")
      } else {
        const err = await res.json()
        alert(err.error || "Failed to save")
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/manage/blog" className="text-foreground/40 hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold font-sans">Edit Post</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-sans text-foreground/60 hover:text-foreground transition-colors"
            style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-sans font-semibold hover:opacity-90 transition-opacity"
            style={{ borderRadius: "var(--card-radius)" }}
          >
            <Eye className="w-4 h-4" />
            {form.status === "published" ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-foreground/40 mb-2">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full bg-transparent px-4 py-3 text-lg font-serif font-bold focus:outline-none focus:ring-1 focus:ring-primary"
              style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-foreground/40 mb-2">Content</label>
            <BlogEditor content={form.content} onChange={(html) => updateField("content", html)} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 space-y-4" style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-foreground/40 mb-1">Slug</label>
              <input type="text" value={form.slug} onChange={(e) => updateField("slug", e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }} />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-foreground/40 mb-1">Category</label>
              <select value={form.category} onChange={(e) => updateField("category", e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}>
                {BLOG_CATEGORIES.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-foreground/40 mb-1">Tags</label>
              <input type="text" value={form.tags} onChange={(e) => updateField("tags", e.target.value)} placeholder="rolex, guide"
                className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }} />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-foreground/40 mb-1">Cover Image URL</label>
              <input type="text" value={form.cover_image} onChange={(e) => updateField("cover_image", e.target.value)} placeholder="https://..."
                className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }} />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-foreground/40 mb-1">Excerpt</label>
              <textarea value={form.excerpt} onChange={(e) => updateField("excerpt", e.target.value)} rows={3} placeholder="Brief summary..."
                className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }} />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-foreground/40 mb-1">Author</label>
              <input type="text" value={form.author} onChange={(e) => updateField("author", e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => updateField("featured", e.target.checked)} className="accent-primary" />
              <span className="text-sm font-sans">Featured post</span>
            </label>
          </div>

          <div className="p-4 space-y-4" style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}>
            <p className="text-xs font-mono uppercase tracking-widest text-foreground/40">SEO</p>
            <div>
              <label className="block text-xs text-foreground/40 mb-1">SEO Title</label>
              <input type="text" value={form.seo_title} onChange={(e) => updateField("seo_title", e.target.value)} placeholder="Custom search title"
                className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }} />
            </div>
            <div>
              <label className="block text-xs text-foreground/40 mb-1">SEO Description</label>
              <textarea value={form.seo_description} onChange={(e) => updateField("seo_description", e.target.value)} rows={3} placeholder="Meta description (160 chars)"
                className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
