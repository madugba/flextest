'use client'

import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Alert, AlertDescription } from '@/shared/ui/Alert'

interface ForgotPasswordSuccessProps {
  email: string
  onTryAnotherEmail: () => void
}

export function ForgotPasswordSuccess({
  email,
  onTryAnotherEmail,
}: ForgotPasswordSuccessProps) {
  return (
    <div className="space-y-6">
      <Alert variant="success">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          If an account exists with {email}, you will receive a password reset email shortly.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <p className="text-sm text-gray-600 text-center">
          Didn&apos;t receive the email? Check your spam folder or try again.
        </p>

        <Button
          onClick={onTryAnotherEmail}
          variant="outline"
          className="w-full"
        >
          Try another email
        </Button>

        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
      </div>
    </div>
  )
}
