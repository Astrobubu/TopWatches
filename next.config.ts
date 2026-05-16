import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [360, 640, 768, 1024, 1280, 1536],
    imageSizes: [64, 128, 256, 384],
    formats: ["image/avif", "image/webp"],
    qualities: [60, 65, 70, 75],
    minimumCacheTTL: 604800,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "kstvsyjfrleyqbgglhjy.supabase.co" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "watchbase.com" },
      { protocol: "https", hostname: "cdn.watchbase.com" },
      { protocol: "https", hostname: "assets.watchbase.com" },
      { protocol: "https", hostname: "*.chrono24.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "langedykvintagewatches.com" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/luxury-watches-in-:slug",
        destination: "/locations/:slug",
      },
    ]
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ]
  },
};

export default nextConfig;
