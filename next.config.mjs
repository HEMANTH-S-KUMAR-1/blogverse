import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: [
      'undici',
      '@vercel/og',
    ],
  },
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core*',
      'node_modules/@esbuild/**',
      'node_modules/webpack/**',
      'node_modules/rollup/**',
      'node_modules/terser/**',
    ],
  },
};

export default nextConfig;