'use client'

import { useState, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { adminApi } from '@/shared/api/adminApi'
import type { DataCounts } from '../types'
import { createFetchDataCounts } from '../handlers/createFetchDataCounts'

interface UseResetSessionsStateArgs {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function useResetSessionsState({ isOpen, onClose, onConfirm }: UseResetSessionsStateArgs) {
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

  const fetchDataCounts = useMemo(
    () => createFetchDataCounts(setIsLoading, setDataCounts),
    []
  )

  useEffect(() => {
    if (isOpen) {
      fetchDataCounts()
      setConfirmationPhrase('')
      setIsAcknowledged(false)
      setIncludeStudents(true)
      setTimeLeft(30)
    }
  }, [isOpen, fetchDataCounts])

  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      toast.error('Session timeout. Please try again.')
      onClose()
    }
  }, [isOpen, timeLeft, onClose])

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

  return {
    confirmationPhrase,
    setConfirmationPhrase,
    isAcknowledged,
    setIsAcknowledged,
    includeStudents,
    setIncludeStudents,
    isLoading,
    isDeleting,
    dataCounts,
    timeLeft,
    requiredPhrase,
    isPhraseValid,
    canConfirm,
    handleConfirm,
  }
}
