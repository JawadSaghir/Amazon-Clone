import type { NextConfig } from "next";

function resolveAppUrl() {
  const configuredUrl = process.env.NEXTAUTH_URL?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configuredUrl) return configuredUrl;

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`;
  }

  return "http://localhost:3000";
}

const appUrl = resolveAppUrl();
process.env.NEXTAUTH_URL = appUrl;
process.env.NEXT_PUBLIC_APP_URL = appUrl;

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "cdn.dummyjson.com" }
    ]
  }
};

export default nextConfig;
