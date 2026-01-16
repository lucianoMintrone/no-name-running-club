import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      // NextAuth Google avatars
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
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
