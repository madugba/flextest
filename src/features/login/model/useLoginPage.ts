'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/shared/hooks/useAuth'
import { getCenterExists } from '@/shared/lib'
import { createHandleSubmit } from './handlers/createHandleSubmit'
import { createTogglePasswordVisibility } from './handlers/createTogglePasswordVisibility'
import type { LoginFormData } from './types'

export function useLoginPage() {
  const router = useRouter()
  const [isCheckingCenter, setIsCheckingCenter] = useState(true)
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading, error, clearError } = useAuth()

  useEffect(() => {
    let cancelled = false

    const checkCenter = async () => {
      const centerExists = await getCenterExists()
      if (cancelled) return

      if (!centerExists) {
        router.replace('/onboarding')
        return
      }

      setIsCheckingCenter(false)
    }

    void checkCenter()

    return () => {
      cancelled = true
    }
  }, [router])

  const handleSubmit = createHandleSubmit({ formData, clearError, login })
  const togglePasswordVisibility = createTogglePasswordVisibility({
    showPassword,
    setShowPassword,
  })

  return {
    isCheckingCenter,
    formData,
    setFormData,
    showPassword,
    togglePasswordVisibility,
    loading,
    error,
    handleSubmit,
  }
}
