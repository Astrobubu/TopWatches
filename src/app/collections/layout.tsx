import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Luxury Watch Collections | Browse Rolex, Patek Philippe, AP & More",
  description:
    "Browse our curated collection of authenticated luxury watches in Dubai. Filter by brand, price, condition & more. Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier.",
  openGraph: {
    title: "Luxury Watch Collections | Golden Planet Watches Dubai",
    description: "Browse authenticated luxury watches. Rolex, Patek Philippe, AP, Omega & more in Dubai.",
  },
}

export default function CollectionsLayout({ children }: { children: React.ReactNode }) {
  return children
}
