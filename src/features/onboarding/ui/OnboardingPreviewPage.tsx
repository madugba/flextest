'use client'

import Link from 'next/link'
import { useOnboardingPreviewPage } from '../model/useOnboardingPreviewPage'
import { CenterReviewCard } from './CenterReviewCard'

export function OnboardingPreviewPage() {
  const { centerData, isSubmitting, error, handleSubmit } = useOnboardingPreviewPage()

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

          <CenterReviewCard centerData={centerData} />

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
