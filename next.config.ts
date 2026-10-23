import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Images uploaded from /admin live in the Supabase "media" bucket; video posters come from YouTube
    remotePatterns: [
      new URL("https://hxcvuhrsbeqakgzohyhx.supabase.co/storage/v1/object/public/media/**"),
      new URL("https://i.ytimg.com/vi/**"),
    ],
    // Portfolio work deserves more than the default compression
    qualities: [75, 90],
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
