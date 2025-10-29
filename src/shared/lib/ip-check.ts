/**
 * IP Check utilities for Edge Runtime
 * Edge Runtime doesn't support Node.js modules like 'os'
 * So we use environment variables for server IP configuration
 */

/**
 * Get allowed server IPs from environment or use defaults
 * Format: comma-separated list in NEXT_PUBLIC_SERVER_IPS
 * Example: "127.0.0.1,192.168.1.100,::1"
 */
function getServerIPs(): Set<string> {
  const ips = new Set<string>()

  // Default local/development IPs
  ips.add('127.0.0.1')
  ips.add('::1')
  ips.add('localhost')

  // Add custom IPs from environment variable
  const customIPs = process.env.NEXT_PUBLIC_SERVER_IPS
  if (customIPs) {
    customIPs.split(',').forEach(ip => {
      const trimmed = ip.trim()
      if (trimmed) ips.add(trimmed)
    })
  }

  return ips
}

/**
 * Extract client IP from request headers
 * Checks x-real-ip and x-forwarded-for headers
 */
export function getClientIP(headers: Headers): string {
  return (
    headers.get('x-real-ip') ||
    headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    '0.0.0.0'
  )
}

/**
 * Check if the given IP is from the server/admin network
 * Returns true for localhost and any configured server IPs
 */
export function isServerIP(ip: string): boolean {
  const serverIPSet = getServerIPs()
  return serverIPSet.has(ip)
}
