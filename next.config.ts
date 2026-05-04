import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    sri: { algorithm: "sha256" },
  },
};

export default nextConfig;
