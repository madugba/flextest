import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for optimized Docker builds
  // This creates a minimal production build with only necessary files
  output: 'standalone',

  // Keep Node.js-only packages out of the Edge/client bundle.
  // pg uses 'util/types' and other Node built-ins; ioredis uses 'net', 'tls', etc.
  // Without this, Turbopack traces them into the Edge instrumentation bundle and
  // fails with "Module not found: Can't resolve 'util/types'".
  serverExternalPackages: ['pg', 'ioredis'],
  
  // Skip type checking during Docker builds (do it separately in CI)
  // This can save 5-15 minutes on large projects
  typescript: {
    ignoreBuildErrors: process.env.SKIP_TYPE_CHECK === 'true',
  },
  
  // Skip ESLint during Docker builds (do it separately in CI)
  // This can save 2-5 minutes
  eslint: {
    ignoreDuringBuilds: process.env.SKIP_LINT === 'true',
  },
  
  // Optimize package imports for faster builds
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      'lucide-react',
      'recharts',
    ],
  },
};

export default nextConfig;
