"use client"

import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "@/lib/i18n/context"
import { Clock, ArrowRight } from "lucide-react"
import type { BlogPost } from "@/lib/blog"

interface BlogListClientProps {
  posts: BlogPost[]
  categories: readonly { value: string; label: string }[]
  category?: string
  page: number
  totalPages: number
}

export function BlogListClient({ posts, categories, category, page, totalPages }: BlogListClientProps) {
  const { t } = useTranslation()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary/60 mb-3">
          {t("blog.journal")}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
          {t("blog.title")}
        </h1>
        <p className="text-foreground/50 font-sans max-w-2xl mx-auto">
          {t("blog.subtitle")}
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <Link
          href="/blog"
          className={`px-4 py-2 text-sm font-sans transition-colors ${
            !category
              ? "bg-primary text-primary-foreground"
              : "text-foreground/50 hover:text-primary"
          }`}
          style={{ borderRadius: "var(--pill-radius)" }}
        >
          {t("blog.all")}
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.value}
            href={`/blog?category=${cat.value}`}
            className={`px-4 py-2 text-sm font-sans transition-colors ${
              category === cat.value
                ? "bg-primary text-primary-foreground"
                : "text-foreground/50 hover:text-primary"
            }`}
            style={{ borderRadius: "var(--pill-radius)" }}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-20 text-foreground/40">
          <p className="font-sans text-lg mb-2">{t("blog.noPosts")}</p>
          <p className="text-sm">{t("blog.noPostsDesc")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <article className="h-full flex flex-col">
                {post.cover_image && (
                  <div className="relative aspect-[16/10] overflow-hidden mb-4" style={{ borderRadius: "var(--card-radius)" }}>
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-primary/70">
                    {post.category.replace("-", " ")}
                  </span>
                  <span className="text-foreground/20">|</span>
                  <span className="flex items-center gap-1 text-foreground/40 text-xs">
                    <Clock className="w-3 h-3" />
                    {post.reading_time} {t("blog.minRead")}
                  </span>
                </div>
                <h2 className="font-serif text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-foreground/50 text-sm font-sans line-clamp-3 mb-4 flex-1">
                    {post.excerpt}
                  </p>
                )}
                <span className="flex items-center gap-1 text-primary text-sm font-sans font-medium mt-auto">
                  {t("blog.readMore")} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </article>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/blog?${category ? `category=${category}&` : ""}page=${p}`}
              className={`w-10 h-10 flex items-center justify-center text-sm font-sans transition-colors ${
                p === page
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/50 hover:text-primary"
              }`}
              style={{ borderRadius: "var(--card-radius)" }}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
