import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A static export: the built site in out/ can be put on any static host.
  output: "export",
  trailingSlash: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  images: { unoptimized: true },
};

export default nextConfig;
