import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { getBlogPosts, BLOG_CATEGORIES } from "@/lib/blog"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { Clock, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Luxury Watch Blog | Guides, News & Expert Insights",
  description:
    "Expert articles on luxury watches in Dubai. Rolex guides, Patek Philippe insights, buying tips, market analysis, and watch care from Golden Planet Watches.",
  openGraph: {
    title: "Luxury Watch Blog | Golden Planet Watches Dubai",
    description: "Expert guides, brand spotlights, buying tips, and market insights for luxury watch enthusiasts.",
  },
}

export const dynamic = "force-dynamic"

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const params = await searchParams
  const category = params.category || undefined
  const page = parseInt(params.page || "1", 10)
  const limit = 12
  const offset = (page - 1) * limit

  const { posts, total } = await getBlogPosts({ category, limit, offset })
  const totalPages = Math.ceil(total / limit)

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://goldenplanetwatches.com" },
          { name: "Blog", url: "https://goldenplanetwatches.com/blog" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary/60 mb-3">
            Journal
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Luxury Watch Blog
          </h1>
          <p className="text-foreground/50 font-sans max-w-2xl mx-auto">
            Expert guides, brand spotlights, buying tips, and market insights from Dubai&apos;s trusted luxury watch dealer.
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
            All
          </Link>
          {BLOG_CATEGORIES.map((cat) => (
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
            <p className="font-sans text-lg mb-2">No posts yet</p>
            <p className="text-sm">Check back soon for expert luxury watch content.</p>
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
                      {post.reading_time} min read
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
                    Read more <ArrowRight className="w-3.5 h-3.5" />
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
    </>
  )
}
