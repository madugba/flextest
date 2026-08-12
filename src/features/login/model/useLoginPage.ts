import { useState } from 'react'
import { useAuth } from '@/shared/contexts/AuthContext'
import { createHandleSubmit } from './handlers/createHandleSubmit'
import { createTogglePasswordVisibility } from './handlers/createTogglePasswordVisibility'
import type { LoginFormData } from './types'

export function useLoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading, error, clearError } = useAuth()

  const handleSubmit = createHandleSubmit({ formData, clearError, login })
  const togglePasswordVisibility = createTogglePasswordVisibility({
    showPassword,
    setShowPassword,
  })

  return {
    formData,
    setFormData,
    showPassword,
    togglePasswordVisibility,
    loading,
    error,
    handleSubmit,
  }
}
