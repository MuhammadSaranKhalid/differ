import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static optimization for better SEO
  reactStrictMode: true,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compress output
  compress: true,

  // Generate ETags for better caching
  generateEtags: true,

  // Headers for SEO and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/differ/:path*',
        has: [
          {
            type: 'query',
            key: 'tool',
            value: '(?<tool>.*)',
          },
        ],
        destination: '/tools/:tool',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
