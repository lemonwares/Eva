import type { NextConfig } from "next";
import { resolve } from "path";
import withPWAInit from "next-pwa";
import { withSentryConfig } from "@sentry/nextjs";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest\.json$/, /.*\.js\.map$/],
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

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Explicitly set the workspace root to this project directory to avoid
  // the "multiple lockfiles" warning from Next.js.
  outputFileTracingRoot: resolve(__dirname),
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
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
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  serverExternalPackages: ["@prisma/client"],
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "192.168.100.22:3000"],
    },
  } as any,
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

export default withSentryConfig(withPWA(nextConfig), {
  // Suppresses source map uploading logs during build
  silent: true,
  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,
  // Hide source maps from generated client bundles
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
  // Tree-shake Sentry debug logging to reduce bundle size
  bundleSizeOptimizations: {
    excludeDebugStatements: true,
  },
});
