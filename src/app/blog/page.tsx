import type { Metadata } from "next"
import { getBlogPosts, BLOG_CATEGORIES } from "@/lib/blog"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { BlogListClient } from "@/components/blog/blog-list-client"

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
      <BlogListClient
        posts={posts}
        categories={BLOG_CATEGORIES}
        category={category}
        page={page}
        totalPages={totalPages}
      />
    </>
  )
}
