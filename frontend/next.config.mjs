/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    // ✅ használd a Next.js beépített optimalizálását (tömörítés, cache, méret)
    unoptimized: false,

    // ✅ engedélyezett domain(ek) – akár több forrás is lehet
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net", // Cloudflare CDN
      },
      {
        protocol: "https",
        hostname: "cdn.dubaimagyarnetwork.com", // ha lesz saját CDN subdomain
      },
    ],

    // ✅ dev környezetben (FastAPI) az uploads elérés is működjön
    domains: ["localhost", "127.0.0.1"],
  },
};

export default nextConfig;
