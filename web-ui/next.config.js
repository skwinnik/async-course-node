/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  rewrites() {
    return [
      {
        source: "/b/view/:path*",
        destination: `${process.env.VIEW_SERVICE}/:path*`,
      },
      {
        source: "/b/auth/:path*",
        destination: `${process.env.AUTH_SERVICE}/auth/:path*`,
      },
      {
        source: "/b/tasks/:path*",
        destination: `${process.env.TASK_SERVICE}/tasks/:path*`,
      },
      {
        source: "/b/transactions/:path*",
        destination: `${process.env.ACCOUNTING_SERVICE}/transactions/:path*`
      },
    ];
  },
  publicRuntimeConfig: {
    baseUrl: process.env.NEXT_URL,
  }
}

module.exports = nextConfig
