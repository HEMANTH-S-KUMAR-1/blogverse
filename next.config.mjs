import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// This bridges your local dev environment to your remote D1/R2 bindings
initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;