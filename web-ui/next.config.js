/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  rewrites() {
    return [
      {
        source: "/b/auth/:path*",
        destination: `${process.env.AUTH_SERVICE}/auth/:path*`,
      },
    ];
  },
  publicRuntimeConfig: {
    baseUrl: process.env.NEXT_URL,
  }
}

module.exports = nextConfig
