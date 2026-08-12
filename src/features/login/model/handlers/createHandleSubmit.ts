import type { FormEvent } from 'react'
import type { LoginRequest } from '@/shared/api/authApi'
import type { LoginFormData } from '../types'

export interface HandleSubmitDeps {
  formData: LoginFormData
  clearError: () => void
  login: (credentials: LoginRequest) => Promise<void>
}

export function createHandleSubmit(deps: HandleSubmitDeps): (e: FormEvent) => Promise<void> {
  const { formData, clearError, login } = deps

  return async (e: FormEvent) => {
    e.preventDefault()
    clearError()

    try {
      await login({ email: formData.email, password: formData.password })
    } catch {
      // error is surfaced through AuthContext
    }
  }
}
