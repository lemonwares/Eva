/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  serverExternalPackages: ["@prisma/client"],
  // Completely disable static optimization for API routes
  experimental: {
    serverActions: {
      allowedOrigins: undefined
    }
  },
  // Override the default build behavior
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Skip static generation
  output: process.env.BUILD_STANDALONE ? 'standalone' : undefined,
  // Custom webpack config to handle Prisma properly
  webpack: (config, { isServer, dev }) => {
    if (isServer) {
      config.externals.push({
        '@prisma/client': 'commonjs @prisma/client'
      });
    }
    return config;
  },
}

module.exports = nextConfig