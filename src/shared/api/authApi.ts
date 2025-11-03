import { apiClient, ApiError } from './client'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  centerId: string | null
  centerName?: string
  permissions: string[]
  phone?: string
  isActive?: boolean
}

export interface TokenResponse {
  accessToken: string
  expiresIn: string
  tokenType: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginData {
  user: User
  token: TokenResponse
}

export interface LoginResponse {
  success: boolean
  message: string
  data: LoginData
}

export interface AuthResponse {
  success: boolean
  data: User
}

/**
 * Admin login
 * @param credentials Login credentials (email and password)
 * @returns User data and JWT token
 * @throws ApiError on invalid credentials or server error
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  try {
    // Backend returns the full LoginResponse structure directly
    // apiClient.post returns ApiResponse<T>, but backend already wraps it
    const response = await apiClient.post<LoginData>('/auth/login', credentials)

    if (!response.success || !response.data) {
      throw new ApiError(
        response.error?.message || 'Login failed',
        response.error?.code || 'LOGIN_FAILED',
        undefined,
        response.error?.details
      )
    }

    // Return the full response structure expected by AuthContext
    return {
      success: response.success,
      message: 'Login successful',
      data: response.data
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      'UNKNOWN_ERROR'
    )
  }
}

/**
 * Admin logout
 * Requires authentication token in header
 * @throws ApiError on logout failure
 */
export async function logout(): Promise<void> {
  try {
    const response = await apiClient.post('/auth/logout', {})

    if (!response.success) {
      throw new ApiError(
        response.error?.message || 'Logout failed',
        response.error?.code || 'LOGOUT_FAILED'
      )
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      'UNKNOWN_ERROR'
    )
  }
}

/**
 * Get current authenticated user profile
 * Requires authentication token in header
 * @returns Current user data
 * @throws ApiError if not authenticated or fetch fails
 */
export async function getCurrentUser(): Promise<User> {
  try {
    const response = await apiClient.get<User>('/auth/me')

    if (!response.success || !response.data) {
      throw new ApiError(
        response.error?.message || 'Failed to fetch user profile',
        response.error?.code || 'FETCH_FAILED',
        undefined,
        response.error?.details
      )
    }

    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      'UNKNOWN_ERROR'
    )
  }
}

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
