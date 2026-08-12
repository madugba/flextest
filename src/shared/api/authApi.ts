import { apiClient, ApiError } from './client'

export { isAuthenticated, setAuthToken, getAuthToken, removeAuthToken } from '@/shared/lib/token-storage'

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

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await apiClient.post<LoginData>('/auth/login', credentials)

    if (!response.success || !response.data) {
      throw new ApiError(
        response.error?.message || 'Login failed',
        response.error?.code || 'LOGIN_FAILED',
        undefined,
        response.error?.details
      )
    }

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
