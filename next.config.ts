import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for optimized Docker builds
  // This creates a minimal production build with only necessary files
  output: 'standalone',
  
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
