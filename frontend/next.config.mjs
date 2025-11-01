/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    unoptimized: true,
    domains: [process.env.NEXT_PUBLIC_IMAGE_DOMAIN || "localhost"],
  },
};

export default nextConfig;
