/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // Ensure Next.js looks for the app directory in the correct location
  distDir: '.next',
  // Proxy API requests to the backend server
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:17880/api/v1/:path*',
      },
    ];
  },
}

module.exports = nextConfig