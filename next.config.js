/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // Ensure Next.js looks for the app directory in the correct location
  distDir: '.next',
}

module.exports = nextConfig