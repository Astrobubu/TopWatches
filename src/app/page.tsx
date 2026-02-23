import { HeroSection } from "@/components/home/hero-section"
import { BrandCarousel } from "@/components/home/brand-carousel"
import { FeaturedWatches } from "@/components/home/featured-watches"
import { CategoriesSection } from "@/components/home/categories-section"
import { TrustSection } from "@/components/home/trust-section"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandCarousel />
      <FeaturedWatches />
      <CategoriesSection />
      <TrustSection />
    </>
  )
}
