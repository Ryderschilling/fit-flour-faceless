/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.wixstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.wixmp.com',
        pathname: '/**',
      },
    ],
  },

  // 301/308 redirects for legacy Wix URLs still indexed by Google.
  // Slugs are identical between the old Wix site and the new build
  // (same Wix backend), so these map 1:1 to live pages.
  async redirects() {
    return [
      // Wix Store product pages -> new product routes
      { source: '/product-page/:slug', destination: '/products/:slug', permanent: true },

      // Wix Blog recipe posts -> new recipe routes
      { source: '/post/:slug', destination: '/recipes/:slug', permanent: true },

      // Wix blog index + category/tag pages -> recipes hub
      { source: '/blog', destination: '/recipes', permanent: true },
      { source: '/blog/:path*', destination: '/recipes', permanent: true },
      { source: '/category/:path*', destination: '/recipes', permanent: true },

      // Other legacy Wix store paths -> shop
      { source: '/store', destination: '/shop', permanent: true },
      { source: '/store/:path*', destination: '/shop', permanent: true },
      { source: '/shop-1', destination: '/shop', permanent: true },
    ]
  },
}

export default nextConfig
