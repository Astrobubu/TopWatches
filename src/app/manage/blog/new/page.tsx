"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BlogEditor } from "@/components/blog/blog-editor"
import { BLOG_CATEGORIES } from "@/lib/blog"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"

export default function NewBlogPostPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
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

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === "title" && !prev.slug) {
        updated.slug = (value as string)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      }
      return updated
    })
  }

  async function handleSave(publishStatus?: "draft" | "published") {
    setSaving(true)
    try {
      const status = publishStatus || form.status
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/manage/blog" className="text-foreground/40 hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold font-sans">New Post</h1>
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
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-foreground/40 mb-2">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Enter post title..."
              className="w-full bg-transparent px-4 py-3 text-lg font-serif font-bold focus:outline-none focus:ring-1 focus:ring-primary"
              style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-foreground/40 mb-2">Content</label>
            <BlogEditor content={form.content} onChange={(html) => updateField("content", html)} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="p-4 space-y-4" style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-foreground/40 mb-1">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                placeholder="auto-generated-from-title"
                className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-foreground/40 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}
              >
                {BLOG_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-foreground/40 mb-1">Tags</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => updateField("tags", e.target.value)}
                placeholder="rolex, buying-guide, dubai"
                className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}
              />
              <p className="text-[10px] text-foreground/30 mt-1">Comma separated</p>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-foreground/40 mb-1">Cover Image URL</label>
              <input
                type="text"
                value={form.cover_image}
                onChange={(e) => updateField("cover_image", e.target.value)}
                placeholder="https://..."
                className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-foreground/40 mb-1">Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => updateField("excerpt", e.target.value)}
                placeholder="Brief summary for listings..."
                rows={3}
                className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-foreground/40 mb-1">Author</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => updateField("author", e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => updateField("featured", e.target.checked)}
                className="accent-primary"
              />
              <span className="text-sm font-sans">Featured post</span>
            </label>
          </div>

          {/* SEO */}
          <div className="p-4 space-y-4" style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}>
            <p className="text-xs font-mono uppercase tracking-widest text-foreground/40">SEO</p>
            <div>
              <label className="block text-xs text-foreground/40 mb-1">SEO Title</label>
              <input
                type="text"
                value={form.seo_title}
                onChange={(e) => updateField("seo_title", e.target.value)}
                placeholder="Custom title for search engines"
                className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}
              />
            </div>
            <div>
              <label className="block text-xs text-foreground/40 mb-1">SEO Description</label>
              <textarea
                value={form.seo_description}
                onChange={(e) => updateField("seo_description", e.target.value)}
                placeholder="Custom meta description (160 chars)"
                rows={3}
                className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
