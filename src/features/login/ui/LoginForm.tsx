'use client'

import type { Dispatch, FormEvent, SetStateAction } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { Alert, AlertDescription } from '@/shared/ui/Alert'
import type { LoginFormData } from '../model/types'

interface LoginFormProps {
  formData: LoginFormData
  setFormData: Dispatch<SetStateAction<LoginFormData>>
  showPassword: boolean
  togglePasswordVisibility: () => void
  loading: boolean
  error: string | null
  onSubmit: (e: FormEvent) => Promise<void>
}

export function LoginForm({
  formData,
  setFormData,
  showPassword,
  togglePasswordVisibility,
  loading,
  error,
  onSubmit,
}: LoginFormProps) {
  return (
    <>
      {error && (
        <Alert variant="error" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={onSubmit} className="space-y-3">
        <Input
          label="Email"
          type="email"
          placeholder="admin@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          fullWidth
          required
          disabled={loading}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            fullWidth
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 bottom-3.5 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
            tabIndex={-1}
            disabled={loading}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full mt-4 h-10" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <p className="text-center text-xs text-gray-500 mt-4">Secure admin authentication</p>
    </>
  )
}
