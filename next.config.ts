import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.amrio.nl",
      },
    ],
  },
};
export default nextConfig;
