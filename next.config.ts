import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
  experimental: {
    // Studio pulls in a large dependency graph; keep it out of the edge bundle.
    optimizePackageImports: ['@portabletext/react'],
  },
}

export default config
