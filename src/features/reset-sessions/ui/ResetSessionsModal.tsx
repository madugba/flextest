'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { adminApi } from '@/shared/api/adminApi'

interface ResetSessionsModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

interface DataCounts {
  sessions: number
  candidates: number
  questions: number
  answers: number
  results: number
  lastSession?: {
    name: string
    date: string
  } | null
}

export function ResetSessionsModal({ isOpen, onClose, onConfirm }: ResetSessionsModalProps) {
  const [confirmationPhrase, setConfirmationPhrase] = useState('')
  const [isAcknowledged, setIsAcknowledged] = useState(false)
  const [includeStudents, setIncludeStudents] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [dataCounts, setDataCounts] = useState<DataCounts | null>(null)
  const [timeLeft, setTimeLeft] = useState(30)

  const requiredPhrase = 'DELETE ALL SESSIONS'
  const isPhraseValid = confirmationPhrase.toUpperCase() === requiredPhrase
  const canConfirm = isAcknowledged && isPhraseValid && !isDeleting

  useEffect(() => {
    if (isOpen) {
      fetchDataCounts()
      setConfirmationPhrase('')
      setIsAcknowledged(false)
      setIncludeStudents(true)
      setTimeLeft(30)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      toast.error('Session timeout. Please try again.')
      onClose()
    }
  }, [isOpen, timeLeft, onClose])

  const fetchDataCounts = async () => {
    setIsLoading(true)
    try {
      const counts = await adminApi.getResetSessionsPreview()
      setDataCounts({
        sessions: counts.sessions || 0,
        candidates: counts.candidates || 0,
        questions: counts.questions || 0,
        answers: counts.answers || 0,
        results: counts.results || 0,
        lastSession: counts.lastSession || null,
      })
    } catch (error) {
      console.warn('Using fallback data due to error:', error)
      setDataCounts({
        sessions: 0,
        candidates: 0,
        questions: 0,
        answers: 0,
        results: 0,
        lastSession: null
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirm = async () => {
    if (!canConfirm) return

    setIsDeleting(true)
    try {
      const data = await adminApi.resetAllSessions({ confirmationPhrase, includeStudents })
      const message = data.message || 'All sessions have been successfully reset'
      toast.success(message)
      onConfirm()
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to reset sessions')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="bg-white rounded-lg shadow-xl">
          <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-red-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-red-900">
                Confirm Reset All Sessions
              </h2>
            </div>
            <div className="mt-2 text-sm text-red-700">
              Time remaining: {timeLeft} seconds
            </div>
          </div>

          <div className="px-6 py-4">
            {isLoading ? (
              <div className="text-center py-4">Loading data counts...</div>
            ) : dataCounts ? (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm font-medium text-red-900 mb-2">
                    This action will permanently delete:
                  </p>
                  {(dataCounts.sessions === 0 && dataCounts.candidates === 0 && dataCounts.questions === 0) ? (
                    <div className="text-sm text-red-700">
                      <p className="mb-2">No data found in the system or backend is unavailable.</p>
                      <p className="text-xs text-red-600">
                        Note: If you&apos;re expecting data, please ensure the backend service is running.
                      </p>
                    </div>
                  ) : (
                    <>
                      <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                        <li>{dataCounts.sessions.toLocaleString()} exam sessions</li>
                        {includeStudents && (
                          <li>{dataCounts.candidates.toLocaleString()} candidates</li>
                        )}
                        <li>{dataCounts.questions.toLocaleString()} questions</li>
                        <li>{dataCounts.answers.toLocaleString()} candidate answers</li>
                        <li>{dataCounts.results.toLocaleString()} exam results</li>
                      </ul>
                      {dataCounts.lastSession && (
                        <p className="mt-3 text-xs text-red-600">
                          Last session: {dataCounts.lastSession.name} ({new Date(dataCounts.lastSession.date).toLocaleDateString()})
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      checked={includeStudents}
                      onChange={(e) => setIncludeStudents(e.target.checked)}
                      className="mt-0.5 mr-2 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Delete all candidates
                      </span>
                      <p className="text-xs text-gray-500">
                        If unchecked, candidates will be kept but unlinked from sessions
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      checked={isAcknowledged}
                      onChange={(e) => setIsAcknowledged(e.target.checked)}
                      className="mt-0.5 mr-2 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      I understand this action cannot be undone
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                      {requiredPhrase}
                    </span> to confirm:
                  </label>
                  <input
                    type="text"
                    value={confirmationPhrase}
                    onChange={(e) => setConfirmationPhrase(e.target.value)}
                    placeholder="Type the confirmation phrase"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      confirmationPhrase && !isPhraseValid
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-red-500'
                    }`}
                    disabled={isDeleting}
                  />
                  {confirmationPhrase && !isPhraseValid && (
                    <p className="mt-1 text-xs text-red-600">
                      Phrase does not match. Please type exactly: {requiredPhrase}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-red-600">
                Failed to load data information
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!canConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isDeleting ? 'Deleting...' : 'Delete Everything'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}