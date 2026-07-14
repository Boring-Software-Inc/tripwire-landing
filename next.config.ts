import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // A stray lockfile exists in the home directory; pin the workspace root.
    root: __dirname,
  },
};

export default nextConfig;
