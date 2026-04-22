import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.amrio.nl",
      },
      {
        protocol: "https",
        hostname: "xjcvdiidvtccsmbwtdmh.supabase.co",
      },
    ],
  },
  watchOptions: {
    pollIntervalMs: 1000,
  },
};
export default nextConfig;
