import type { NextConfig } from "next"
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL
const nextConfig: NextConfig = {
  images: {
    domains: ['freshers-intro-images.s3.eu-north-1.amazonaws.com','local-host-thing.s3.eu-north-1.amazonaws.com',
],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND}/:path*`,
      },
    ]
  },

}

export default nextConfig
