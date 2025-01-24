import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
      bodySizeLimit: "100mb",
    }
  },
  images: {
    remotePatterns: [
      {
        hostname: "utfs.io"
      }
    ]
  },
  reactStrictMode: false,
};

export default nextConfig;