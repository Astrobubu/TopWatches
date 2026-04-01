"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Pencil, Trash2, Eye, FileText } from "lucide-react"
import type { BlogPost } from "@/lib/blog"

export default function ManageBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/blog?status=${filter}`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setPosts(data) })
      .finally(() => setLoading(false))
  }, [filter])

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return
    await fetch(`/api/blog?id=${id}`, { method: "DELETE" })
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  async function togglePublish(post: BlogPost) {
    const newStatus = post.status === "published" ? "draft" : "published"
    const res = await fetch("/api/blog", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: post.id, status: newStatus }),
    })
    if (res.ok) {
      const updated = await res.json()
      setPosts((prev) => prev.map((p) => (p.id === post.id ? updated : p)))
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-sans">Blog Posts</h1>
          <p className="text-foreground/50 text-sm mt-1">Manage your blog content</p>
        </div>
        <Link
          href="/manage/blog/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-sans font-semibold hover:opacity-90 transition-opacity"
          style={{ borderRadius: "var(--card-radius)" }}
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6">
        {["all", "published", "draft"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-sm font-sans capitalize transition-colors ${
              filter === s ? "bg-primary text-primary-foreground" : "text-foreground/50 hover:text-foreground"
            }`}
            style={{ borderRadius: "var(--card-radius)" }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Posts table */}
      {loading ? (
        <div className="text-center py-12 text-foreground/40">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-foreground/40">
          <FileText className="w-10 h-10 mx-auto mb-3 text-primary/30" />
          <p>No posts found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 p-4 bg-muted/20 hover:bg-muted/40 transition-colors"
              style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-sans font-semibold text-sm truncate">{post.title}</h3>
                  <span
                    className={`text-[10px] px-2 py-0.5 font-mono uppercase tracking-wider ${
                      post.status === "published"
                        ? "text-green-500 bg-green-500/10"
                        : "text-yellow-500 bg-yellow-500/10"
                    }`}
                    style={{ borderRadius: "var(--pill-radius)" }}
                  >
                    {post.status}
                  </span>
                  {post.featured && (
                    <span className="text-[10px] px-2 py-0.5 font-mono uppercase tracking-wider text-primary bg-primary/10" style={{ borderRadius: "var(--pill-radius)" }}>
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-foreground/40">
                  <span className="capitalize">{post.category.replace("-", " ")}</span>
                  <span>{post.reading_time} min read</span>
                  {post.published_at && (
                    <span>{new Date(post.published_at).toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => togglePublish(post)}
                  className="p-2 text-foreground/40 hover:text-primary transition-colors"
                  title={post.status === "published" ? "Unpublish" : "Publish"}
                >
                  <Eye className="w-4 h-4" />
                </button>
                <Link
                  href={`/manage/blog/${post.id}/edit`}
                  className="p-2 text-foreground/40 hover:text-primary transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(post.id, post.title)}
                  className="p-2 text-foreground/40 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <Link href="/manage" className="text-foreground/40 hover:text-primary text-sm font-sans transition-colors">
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
