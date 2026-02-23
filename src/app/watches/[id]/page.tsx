import { watches } from "@/data/watches"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ImageGallery } from "@/components/watches/image-gallery"
import { WatchSpecs } from "@/components/watches/watch-specs"
import { RelatedWatches } from "@/components/watches/related-watches"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Heart, Share2, ShoppingBag } from "lucide-react"
import type { Metadata } from "next"

// Generate static params for all 18 watches
export function generateStaticParams() {
  return watches.map((w) => ({ id: w.id }))
}

// Generate metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const watch = watches.find((w) => w.id === id)
  return {
    title: watch
      ? `${watch.brand} ${watch.model} | KRONOS`
      : "Watch Not Found",
  }
}

export default async function WatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const watch = watches.find((w) => w.id === id)
  if (!watch) return notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          href="/collections"
          className="hover:text-foreground transition-colors"
        >
          Collections
        </Link>
        <span>/</span>
        <Link
          href={`/collections?brand=${watch.brand.toLowerCase().replace(/\s+/g, "-")}`}
          className="hover:text-foreground transition-colors"
        >
          {watch.brand}
        </Link>
        <span>/</span>
        <span className="text-foreground">{watch.model}</span>
      </nav>

      {/* Main product section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Image Gallery */}
        <ImageGallery
          images={watch.images}
          modelName={`${watch.brand} ${watch.model}`}
        />

        {/* Right: Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-wider text-muted-foreground mb-1">
              {watch.brand}
            </p>
            <h1 className="font-serif text-3xl md:text-4xl font-bold">
              {watch.model}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Ref. {watch.reference}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="secondary">{watch.condition}</Badge>
            <Badge variant="outline">{watch.category}</Badge>
          </div>

          <Separator />

          <p className="text-4xl font-bold">
            ${watch.price.toLocaleString()}
          </p>

          <div className="flex gap-3">
            <Button className="flex-1 bg-gold hover:bg-gold/90 text-white rounded-none py-6 text-sm uppercase tracking-wider">
              <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-none h-12 w-12"
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-none h-12 w-12"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <Separator />

          {/* Tabs: Description | Specifications */}
          <Tabs defaultValue="description">
            <TabsList className="w-full">
              <TabsTrigger value="description" className="flex-1">
                Description
              </TabsTrigger>
              <TabsTrigger value="specs" className="flex-1">
                Specifications
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-4">
              <p className="text-muted-foreground leading-relaxed">
                {watch.description}
              </p>
            </TabsContent>
            <TabsContent value="specs" className="pt-4">
              <WatchSpecs specs={watch.specs} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related watches */}
      <RelatedWatches currentWatch={watch} />
    </div>
  )
}
