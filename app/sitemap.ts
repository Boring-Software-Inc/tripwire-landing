import type { MetadataRoute } from "next";

const BASE = "https://tripwire.sh";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/dither-kit`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/pilot`, changeFrequency: "daily", priority: 0.7 },
  ];
}
