import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Allow images served from Cloudinary (our media storage).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  eslint: {
    // Lint only these directories during `next build`.
    dirs: ["src"],
  },
};

export default nextConfig;
