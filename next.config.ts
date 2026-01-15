import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest\.json$/],
  fallbacks: {
    document: "/offline", // Fallback page when offline
  },
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/nominatim\.openstreetmap\.org\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "geocoding-api",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
        },
      },
    },
  ],
});

// { protocol: "https", hostname: "lh3.googleusercontent.com" },
// { protocol: "https", hostname: "avatars.githubusercontent.com" },
// { protocol: "https", hostname: "res.cloudinary.com" },

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  serverExternalPackages: ["@prisma/client"],
  experimental: {
    serverActions: {
      allowedOrigins: undefined,
    },
  },
  generateBuildId: async () => {
    return "build-" + Date.now();
  },
  output: process.env.BUILD_STANDALONE ? "standalone" : undefined,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        "@prisma/client": "commonjs @prisma/client",
      });
    }
    return config;
  },
};

export default withPWA(nextConfig);
