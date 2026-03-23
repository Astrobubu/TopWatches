import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ReviewPrompt } from "@/components/review-prompt";
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
  title: "Golden Watches | Luxury Watch Marketplace",
  description: "Buy and sell luxury watches from Rolex, Patek Philippe, Audemars Piguet, Omega and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* ALL fonts loaded via CDN for maximum reliability */}
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=IBM+Plex+Mono:wght@300;400;500&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=JetBrains+Mono:wght@300;400;500;700&family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&family=Space+Mono:wght@400;700&family=Orbitron:wght@400;500;600;700;800;900&family=Fira+Code:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Crimson+Pro:ital,wght@0,400;0,600;1,400;1,600&family=Source+Code+Pro:wght@300;400;500&family=Montserrat:wght@300;400;500;600;700;800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inconsolata:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased transition-colors duration-500">
        <ThemeProvider
          attribute="class"
          defaultTheme="theme-organic-tech"
          themes={["theme-organic-tech", "theme-midnight-luxe", "theme-brutalist-signal", "theme-neon-cyberpunk", "theme-minimalist-sand", "theme-ocean-depth"]}
          enableSystem={false}
        >
          <I18nProvider>
            <NoiseOverlay />
            <Header />
            <main className="min-h-screen pt-20">{children}</main>
            <Footer />
            <ReviewPrompt />
            <ScrollToTop />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
