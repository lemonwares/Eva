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

const nextConfig: NextConfig = {};

export default withPWA(nextConfig);
