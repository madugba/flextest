'use client'

import Image from 'next/image'
import { useForgotPasswordPage } from '../model/useForgotPasswordPage'
import { ForgotPasswordForm } from './ForgotPasswordForm'
import { ForgotPasswordSuccess } from './ForgotPasswordSuccess'

export function ForgotPasswordPage() {
  const { email, setEmail, submitted, setSubmitted, loading, error, handleSubmit } =
    useForgotPasswordPage()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-lg border border-gray-200 p-8 w-full max-w-md">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4">
            <Image
              src="/logo-small.png"
              alt="FlexTest"
              width={60}
              height={60}
              className="drop-shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600 text-center">
            {submitted
              ? 'Check your email for reset instructions'
              : 'Enter your email to receive reset instructions'}
          </p>
        </div>

        {/* Success Message */}
        {submitted ? (
          <ForgotPasswordSuccess
            email={email}
            onTryAnotherEmail={() => setSubmitted(false)}
          />
        ) : (
          <ForgotPasswordForm
            email={email}
            setEmail={setEmail}
            loading={loading}
            error={error}
            onSubmit={handleSubmit}
          />
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          Secure admin authentication
        </p>
      </div>
    </div>
  )
}
