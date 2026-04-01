import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Men's Luxury Watches | Rolex, Patek Philippe, AP for Him",
  description:
    "Discover luxury watches for men in Dubai. Rolex Submariner, Patek Philippe Nautilus, AP Royal Oak & more. 39mm+ case sizes. Authenticated & delivered.",
  openGraph: {
    title: "Men's Luxury Watches | Golden Planet Watches Dubai",
    description: "Premium luxury watches for men. Rolex, Patek Philippe, AP & more. 39mm+ sizes.",
  },
}

export default function ForHimLayout({ children }: { children: React.ReactNode }) {
  return children
}
