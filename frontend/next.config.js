/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  trailingSlash: true,
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
