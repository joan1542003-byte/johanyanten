import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Images uploaded from /admin live in the Supabase "media" bucket
    remotePatterns: [new URL("https://hxcvuhrsbeqakgzohyhx.supabase.co/storage/v1/object/public/media/**")],
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
