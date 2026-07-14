import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // A stray lockfile exists in the home directory; pin the workspace root.
    root: __dirname,
  },
  // The dither-kit registry is served as static JSON from `public/r/`. These
  // headers match HOSTING.md: CORS-open so browser tooling can read it, and a
  // short edge TTL (max-age=300) with stale-while-revalidate so newly-added
  // components aren't stacked behind a long CDN cache on top of the CLI's
  // own 1h local cache.
  async headers() {
    return [
      {
        source: "/r/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Cache-Control",
            value: "public, max-age=300, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
