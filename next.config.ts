import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
    ],
  },
};

export default nextConfig;
