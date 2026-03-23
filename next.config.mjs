import withBundleAnalyzer from '@next/bundle-analyzer'

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  // output: 'export', // disabled for D1/Cloudflare Pages Functions
  images: {
    unoptimized: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  staticPageGenerationTimeout: 120,
  transpilePackages: ['next-mdx-remote'],
}

export default bundleAnalyzer(nextConfig)
