/**
 * Application configuration
 * Automatically detects local IP in development for cross-device access
 */
export const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/v1/api',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  importApiBaseUrl: process.env.NEXT_PUBLIC_IMPORT_API_URL || 'https://fastapi-5gql.onrender.com',
} as const
