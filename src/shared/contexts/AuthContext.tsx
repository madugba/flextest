'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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
import { ApiError } from '@/shared/api/client'

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
  clearError: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken()

      if (!token) {
        setLoading(false)
        return
      }

      try {
        const userData = await getCurrentUser()
        setUser(userData)
      } catch {
        removeAuthToken()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiLogin(credentials)

      setAuthToken(response.data.token.accessToken)

      setUser(response.data.user)

      router.push('/dashboard')
    } catch (err) {
      const errorMessage = err instanceof ApiError
        ? err.message
        : 'Login failed. Please try again.'

      setError(errorMessage)
      removeAuthToken()
      setUser(null)
      throw err
    } finally {
      setLoading(false)
    }
  }, [router])

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
      const userData = await getCurrentUser()
      setUser(userData)
    } catch {
      removeAuthToken()
      setUser(null)
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

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    refreshUser,
    updateUser,
    clearError,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
