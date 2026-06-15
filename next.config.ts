import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@mui/material", "lucide-react"]
  }
};

export default nextConfig;
