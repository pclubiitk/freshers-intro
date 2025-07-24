import type { NextConfig } from "next"
const ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN
const nextConfig: NextConfig = {
  images: {
    domains: ['freshers-intro-images.s3.eu-north-1.amazonaws.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${ORIGIN}/:path*`,
      },
    ]
  },

}

export default nextConfig
