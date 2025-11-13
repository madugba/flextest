import { networkInterfaces } from 'os'

/**
 * Get the local network IP address
 * Returns the first non-internal IPv4 address found
 * Falls back to localhost if no network IP is found
 */
export function getLocalIP(): string {
  try {
    const nets = networkInterfaces()
    for (const name of Object.keys(nets)) {
      const netInterface = nets[name]
      console.log('Network interface...', netInterface)
      if (!netInterface) continue

      for (const net of netInterface) {
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
          return net.address
        }
      }
    }
  } catch (error) {
    console.warn('Failed to detect local IP, falling back to localhost:', error)
  }

  return 'localhost'
}

/**
 * Build API URL using local IP for cross-device access
 * In production, this should use the actual API domain
 */
export function buildApiUrl(port: number = 3000, path: string = '/v1/api'): string {
  const localIP = getLocalIP()
  return `http://${localIP}:${port}${path}`
}
