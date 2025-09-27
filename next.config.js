/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/admin/login',
      },
    ];
  },
  // Optimize for production
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig