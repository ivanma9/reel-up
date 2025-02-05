/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
      serverActions: {
          bodySizeLimit: '100mb'  // Increase the limit to 100MB
      }
  },
  // ... other existing config options
}

module.exports = nextConfig