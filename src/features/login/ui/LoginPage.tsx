'use client'

import Image from 'next/image'
import { Spinner } from '@/shared/ui/Spinner'
import { useLoginPage } from '../model/useLoginPage'
import { LoginForm } from './LoginForm'

export function LoginPage() {
  const {
    isCheckingCenter,
    formData,
    setFormData,
    showPassword,
    togglePasswordVisibility,
    loading,
    error,
    handleSubmit,
  } = useLoginPage()

  if (isCheckingCenter) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Spinner className="size-8 text-blue-600" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-lg border border-gray-200 p-6 w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="mb-3">
            <Image
              src="/logo-small.png"
              alt="FlexTest"
              width={48}
              height={48}
              className="drop-shadow-lg"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">FlexTest</h1>
          <p className="text-sm text-gray-600">Sign in to your admin account</p>
        </div>

        <LoginForm
          formData={formData}
          setFormData={setFormData}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          loading={loading}
          error={error}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
