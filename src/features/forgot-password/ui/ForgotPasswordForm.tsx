'use client'

import type { Dispatch, FormEvent, SetStateAction } from 'react'
import Link from 'next/link'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { Alert, AlertDescription } from '@/shared/ui/Alert'

interface ForgotPasswordFormProps {
  email: string
  setEmail: Dispatch<SetStateAction<string>>
  loading: boolean
  error: string
  onSubmit: (e: FormEvent) => Promise<void>
}

export function ForgotPasswordForm({
  email,
  setEmail,
  loading,
  error,
  onSubmit,
}: ForgotPasswordFormProps) {
  return (
    <>
      {error && (
        <Alert variant="error" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          disabled={loading}
        />

        <Button
          type="submit"
          className="w-full mt-6 h-12"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
      </div>
    </>
  )
}
