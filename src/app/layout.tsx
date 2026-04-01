import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ReviewPrompt } from "@/components/review-prompt";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Analytics } from "@/components/analytics";
import { OrganizationSchema, WebSiteSchema } from "@/components/seo/json-ld";
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/lib/i18n/context"
import "./globals.css";

const NoiseOverlay = () => (
  <svg
    className="noise-overlay"
    aria-hidden="true"
    style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999, opacity: 0.05 }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

export const metadata: Metadata = {
  title: {
    default: "Golden Planet Watches | Buy Luxury Watches in Dubai | Est. 2010",
    template: "%s | Golden Planet Watches Dubai",
  },
  description:
    "Buy authenticated luxury watches in Dubai. Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier & more. Pre-owned & new. Free delivery. WhatsApp us today.",
  keywords: [
    "luxury watches dubai",
    "buy rolex dubai",
    "pre-owned watches dubai",
    "patek philippe dubai",
    "audemars piguet dubai",
    "omega watches dubai",
    "golden planet watches",
  ],
  metadataBase: new URL("https://goldenplanetwatches.com"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_AE",
    siteName: "Golden Planet Watches",
    title: "Golden Planet Watches | Buy Luxury Watches in Dubai",
    description:
      "Authenticated luxury watches in Dubai. Rolex, Patek Philippe, AP, Omega & more. Est. 2010.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Golden Planet Watches | Luxury Watches Dubai",
    description:
      "Buy authenticated luxury watches in Dubai. Rolex, Patek Philippe, Audemars Piguet & more.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <OrganizationSchema />
        <WebSiteSchema />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* ALL fonts loaded via CDN for maximum reliability */}
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=IBM+Plex+Mono:wght@300;400;500&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=JetBrains+Mono:wght@300;400;500;700&family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&family=Space+Mono:wght@400;700&family=Orbitron:wght@400;500;600;700;800;900&family=Fira+Code:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Crimson+Pro:ital,wght@0,400;0,600;1,400;1,600&family=Source+Code+Pro:wght@300;400;500&family=Montserrat:wght@300;400;500;600;700;800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inconsolata:wght@300;400;500;600;700&family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Tajawal:wght@300;400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased transition-colors duration-500">
        <ThemeProvider
          attribute="class"
          defaultTheme="theme-brutalist-signal"
          themes={["theme-organic-tech", "theme-midnight-luxe", "theme-brutalist-signal", "theme-neon-cyberpunk", "theme-minimalist-sand", "theme-ocean-depth", "theme-rolex-heritage", "theme-rolex-heritage-dark"]}
          enableSystem={false}
        >
          <I18nProvider>
            <NoiseOverlay />
            <Header />
            <main className="min-h-screen pt-20">{children}</main>
            <Footer />
            <ReviewPrompt />
            <WhatsAppButton />
            <Analytics />
            <ScrollToTop />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
