'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { clearCenterCache } from '@/shared/lib'

interface CenterData {
  centerName: string
  address: string
  phone: string
  email: string
  state: string
  lga: string
}

export default function OnboardingPreviewPage() {
  const router = useRouter()
  const [centerData, setCenterData] = useState<CenterData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const data = sessionStorage.getItem('centerData')
    if (!data) {
      router.push('/onboarding/setup')
      return
    }
    setCenterData(JSON.parse(data))
  }, [router])

  const handleSubmit = async () => {
    if (!centerData) return

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('http://localhost:3000/api/centers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(centerData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Failed to create center')
      }

      sessionStorage.removeItem('centerData')
      clearCenterCache()
      router.push('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create center')
      setIsSubmitting(false)
    }
  }

  if (!centerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Review Your Information
          </h1>
          <p className="text-gray-600 mb-8">
            Please verify your center details before submission
          </p>

          <div className="space-y-4 mb-8">
            <div className="border-b pb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Center Name</h3>
              <p className="text-lg text-gray-900">{centerData.centerName}</p>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Email Address</h3>
              <p className="text-lg text-gray-900">{centerData.email}</p>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Phone Number</h3>
              <p className="text-lg text-gray-900">{centerData.phone}</p>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Address</h3>
              <p className="text-lg text-gray-900">{centerData.address}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border-b pb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">State</h3>
                <p className="text-lg text-gray-900">{centerData.state}</p>
              </div>

              <div className="border-b pb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">LGA</h3>
                <p className="text-lg text-gray-900">{centerData.lga}</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Link
              href="/onboarding/setup"
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 text-center rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Edit Information
            </Link>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit & Complete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
