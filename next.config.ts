import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    "miniature-tribble-5g7q77r9r5fv4r7-3000.app.github.dev",
    "*.app.github.dev",
  ],
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "miniature-tribble-5g7q77r9r5fv4r7-3000.app.github.dev",
      ],
    },
  },
};

export default nextConfig;
