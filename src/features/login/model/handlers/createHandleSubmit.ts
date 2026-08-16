import type { FormEvent } from 'react'
import type { LoginRequest } from '@/shared/api/authApi'
import type { LoginResult } from '@/shared/contexts/AuthContext'
import type { LoginFormData } from '../types'

export interface HandleSubmitDeps {
  formData: LoginFormData
  clearError: () => void
  login: (credentials: LoginRequest) => Promise<LoginResult>
}

export function createHandleSubmit(deps: HandleSubmitDeps): (e: FormEvent) => Promise<void> {
  const { formData, clearError, login } = deps

  return async (e: FormEvent) => {
    e.preventDefault()
    clearError()
    // login never throws; the error is surfaced through AuthContext
    await login({ email: formData.email, password: formData.password })
  }
}
