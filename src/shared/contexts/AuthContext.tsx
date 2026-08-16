'use client'

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  login as apiLogin,
  logout as apiLogout,
  getCurrentUser,
  setAuthToken,
  removeAuthToken,
  getAuthToken,
  type User,
  type LoginRequest,
} from '@/shared/api/authApi'
import { ApiError, onUnauthorized } from '@/shared/api/client'

export type LoginResult = { success: true } | { success: false; message: string }

export interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (credentials: LoginRequest) => Promise<LoginResult>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
  clearError: () => void
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      const token = getAuthToken()

      if (!token) {
        if (mounted) setLoading(false)
        return
      }

      try {
        const userData = await getCurrentUser()
        if (mounted) setUser(userData)
      } catch {
        if (mounted) {
          removeAuthToken()
          setUser(null)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    initAuth()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const handleUnauthorized = () => {
      removeAuthToken()
      setUser(null)
      if (pathname !== '/login') {
        router.push('/login')
      }
    }

    return onUnauthorized(handleUnauthorized)
  }, [router, pathname])

  const login = useCallback(
    async (credentials: LoginRequest): Promise<LoginResult> => {
      try {
        setLoading(true)
        setError(null)

        const response = await apiLogin(credentials)

        setAuthToken(response.data.token.accessToken)

        setUser(response.data.user)

        router.push('/dashboard')

        return { success: true }
      } catch (err) {
        const errorMessage =
          err instanceof ApiError ? err.message : 'Login failed. Please try again.'

        setError(errorMessage)
        removeAuthToken()
        setUser(null)

        return { success: false, message: errorMessage }
      } finally {
        setLoading(false)
      }
    },
    [router]
  )

  const logout = useCallback(async () => {
    try {
      setLoading(true)

      try {
        await apiLogout()
      } catch {
      }

      removeAuthToken()
      setUser(null)
      setError(null)

      router.push('/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  const refreshUser = useCallback(async () => {
    try {
      setError(null)
      const userData = await getCurrentUser()
      setUser(userData)
    } catch {
      removeAuthToken()
      setUser(null)
      setError('Session expired. Please log in again.')
      router.push('/login')
    }
  }, [router])

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null
      return { ...prevUser, ...userData }
    })
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      error,
      login,
      logout,
      refreshUser,
      updateUser,
      clearError,
      isAuthenticated: !!user,
    }),
    [user, loading, error, login, logout, refreshUser, updateUser, clearError]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
