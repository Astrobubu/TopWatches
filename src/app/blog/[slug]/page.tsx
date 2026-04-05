import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getBlogPost, getRelatedPosts } from "@/lib/blog"
import { ArticleSchema, BreadcrumbSchema } from "@/components/seo/json-ld"
import { BlogDetailClient } from "@/components/blog/blog-detail-client"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return { title: "Post Not Found" }

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || `Read ${post.title} on Golden Planet Watches blog.`,
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt || undefined,
      images: post.cover_image ? [{ url: post.cover_image }] : [],
      type: "article",
      publishedTime: post.published_at || undefined,
      authors: [post.author],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return notFound()

  const related = await getRelatedPosts(post.id, post.category)

  return (
    <>
      <ArticleSchema
        title={post.seo_title || post.title}
        description={post.seo_description || post.excerpt || ""}
        image={post.cover_image || undefined}
        url={`https://goldenplanetwatches.com/blog/${post.slug}`}
        datePublished={post.published_at || post.created_at}
        dateModified={post.updated_at}
        author={post.author}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://goldenplanetwatches.com" },
          { name: "Blog", url: "https://goldenplanetwatches.com/blog" },
          { name: post.title, url: `https://goldenplanetwatches.com/blog/${post.slug}` },
        ]}
      />
      <BlogDetailClient post={post} related={related} />
    </>
  )
}
