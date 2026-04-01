import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { getBlogPost, getRelatedPosts } from "@/lib/blog"
import { ArticleSchema, BreadcrumbSchema } from "@/components/seo/json-ld"
import { Clock, ArrowLeft, ArrowRight } from "lucide-react"

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

function TableOfContents({ content }: { content: string }) {
  const headings: { id: string; text: string; level: number }[] = []
  const regex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi
  let match
  while ((match = regex.exec(content)) !== null) {
    const text = match[2].replace(/<[^>]*>/g, "")
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    headings.push({ id, text, level: parseInt(match[1]) })
  }

  if (headings.length < 3) return null

  return (
    <nav className="p-5 mb-8 bg-muted/30" style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}>
      <p className="font-mono text-[10px] tracking-widest uppercase text-primary/60 mb-3">Contents</p>
      <ul className="space-y-1.5">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "ml-4" : ""}>
            <a href={`#${h.id}`} className="text-sm font-sans text-foreground/60 hover:text-primary transition-colors">
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function addHeadingIds(content: string): string {
  return content.replace(/<h([23])([^>]*)>(.*?)<\/h([23])>/gi, (_, level, attrs, text, closeLevel) => {
    const plainText = text.replace(/<[^>]*>/g, "")
    const id = plainText.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    return `<h${level}${attrs} id="${id}">${text}</h${closeLevel}>`
  })
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
  const contentWithIds = addHeadingIds(post.content)
  const publishDate = post.published_at ? new Date(post.published_at) : null

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

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm font-sans text-foreground/50 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="text-border">/</span>
          <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <span className="text-border">/</span>
          <span className="text-foreground/70 line-clamp-1">{post.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[10px] tracking-widest uppercase text-primary/70">
              {post.category.replace("-", " ")}
            </span>
            <span className="text-foreground/20">|</span>
            <span className="flex items-center gap-1 text-foreground/40 text-xs">
              <Clock className="w-3 h-3" />
              {post.reading_time} min read
            </span>
            {publishDate && (
              <>
                <span className="text-foreground/20">|</span>
                <time dateTime={post.published_at || ""} className="text-foreground/40 text-xs">
                  {publishDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </time>
              </>
            )}
          </div>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-foreground/50 font-sans text-lg leading-relaxed">
              {post.excerpt}
            </p>
          )}
          <p className="text-foreground/40 text-sm font-sans mt-4">
            By {post.author}
          </p>
        </header>

        {/* Cover Image */}
        {post.cover_image && (
          <div className="relative aspect-[2/1] overflow-hidden mb-10" style={{ borderRadius: "var(--card-radius)" }}>
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </div>
        )}

        {/* Table of Contents */}
        <TableOfContents content={post.content} />

        {/* Content */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:font-serif prose-headings:text-foreground
            prose-p:text-foreground/70 prose-p:font-sans prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground
            prose-li:text-foreground/70
            prose-blockquote:border-primary prose-blockquote:text-foreground/60
            prose-img:rounded-lg
            prose-code:text-primary prose-code:bg-muted/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          "
          dangerouslySetInnerHTML={{ __html: contentWithIds }}
        />

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-foreground/10">
          <div className="flex items-center gap-4">
            <span className="text-foreground/40 text-sm font-sans">Share:</span>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(post.title + " - https://goldenplanetwatches.com/blog/" + post.slug)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/40 hover:text-[#25D366] transition-colors text-sm font-sans"
            >
              WhatsApp
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent("https://goldenplanetwatches.com/blog/" + post.slug)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/40 hover:text-primary transition-colors text-sm font-sans"
            >
              X / Twitter
            </a>
            <button
              className="text-foreground/40 hover:text-primary transition-colors text-sm font-sans"
              onClick={undefined}
              data-copy-url={`https://goldenplanetwatches.com/blog/${post.slug}`}
            >
              Copy Link
            </button>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-8 p-6 bg-muted/30 text-center" style={{ borderRadius: "var(--card-radius)", border: "var(--border-w) solid var(--border)" }}>
          <p className="font-serif text-xl font-bold mb-2">Have questions about luxury watches?</p>
          <p className="text-foreground/50 text-sm font-sans mb-4">Our experts are here to help. Chat with us on WhatsApp.</p>
          <a
            href="https://wa.me/1234567890?text=Hi%2C%20I%20have%20a%20question%20about%20luxury%20watches"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-sans font-semibold text-sm hover:opacity-90 transition-opacity"
            style={{ borderRadius: "var(--card-radius)" }}
          >
            Chat on WhatsApp
          </a>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="group">
                  {r.cover_image && (
                    <div className="relative aspect-[16/10] overflow-hidden mb-3" style={{ borderRadius: "var(--card-radius)" }}>
                      <Image
                        src={r.cover_image}
                        alt={r.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <h3 className="font-serif text-base font-bold group-hover:text-primary transition-colors">
                    {r.title}
                  </h3>
                  <span className="flex items-center gap-1 text-primary text-xs font-sans mt-2">
                    Read more <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blog */}
        <div className="mt-12 pt-8 border-t border-foreground/10">
          <Link href="/blog" className="flex items-center gap-2 text-foreground/50 hover:text-primary transition-colors text-sm font-sans">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </article>
    </>
  )
}
