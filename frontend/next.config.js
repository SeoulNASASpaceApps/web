/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  trailingSlash: true,
  // Auth and API proxy URLs must reach the service without a slash redirect.
  skipTrailingSlashRedirect: true,
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
