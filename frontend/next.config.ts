import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["http://192.168.1.63:3000"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.dubaimagyarnetwork.com",
      },
    ],
  },
};

export default nextConfig;
