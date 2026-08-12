/**
 * Check authentication status
 * @returns true if user has valid token
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false

  const token = localStorage.getItem('accessToken')
  return !!token
}

/**
 * Store authentication token
 * @param token JWT access token
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return

  localStorage.setItem('accessToken', token)
}

/**
 * Get stored authentication token
 * @returns JWT access token or null
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null

  return localStorage.getItem('accessToken')
}

/**
 * Remove authentication token
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return

  localStorage.removeItem('accessToken')
}
