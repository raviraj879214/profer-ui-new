import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Add this to ignore ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Other config options...
};

export default nextConfig;
