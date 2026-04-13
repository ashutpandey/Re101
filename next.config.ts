import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Enable image optimization
  images: {
    unoptimized: false,
  },
};

export default nextConfig;
