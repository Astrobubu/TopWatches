import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Women's Luxury Watches | Cartier, Rolex, Omega for Her",
  description:
    "Explore luxury watches for women in Dubai. Cartier, Rolex Datejust, Omega & more. Elegant timepieces under 39mm. Authenticated & delivered across Dubai.",
  openGraph: {
    title: "Women's Luxury Watches | Golden Planet Watches Dubai",
    description: "Elegant luxury watches for women. Cartier, Rolex, Omega & more in Dubai.",
  },
}

export default function ForHerLayout({ children }: { children: React.ReactNode }) {
  return children
}
