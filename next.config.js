/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-domain.com'],
  },
  experimental: {
    optimizePackageImports: ['livekit-client'],
  },
};

module.exports = nextConfig;