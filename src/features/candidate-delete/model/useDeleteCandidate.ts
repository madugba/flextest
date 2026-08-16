'use client'

import { useState } from 'react'
import { deleteCandidate, getCandidateById, type Candidate } from '@/entities/candidate'
import { ApiError } from '@/shared/api/client'
import { getBlockedCandidateIds } from '../lib/getBlockedCandidateIds'

type VerifyState = 'idle' | 'verifying' | 'blocked' | 'ready'

export function useDeleteCandidate(onSuccess?: () => void) {
  const [isOpen, setIsOpen]                       = useState(false)
  const [isLoading, setIsLoading]                 = useState(false)
  const [verifyState, setVerifyState]             = useState<VerifyState>('idle')
  const [error, setError]                         = useState<string | null>(null)
  const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null)

  const handleOpen = async (candidate: Candidate) => {
    setCandidateToDelete(candidate)
    setError(null)
    setIsOpen(true)
    setVerifyState('verifying')

    try {
      // Get fresh candidate data and cross-check ALL sessions for ACTIVE/SUBMITTED history
      const [fresh, blockedIds] = await Promise.all([
        getCandidateById(candidate.id),
        getBlockedCandidateIds([candidate.id]),
      ])
      setCandidateToDelete(fresh)
      setVerifyState(blockedIds.has(candidate.id) ? 'blocked' : 'ready')
    } catch {
      // Verification failed — fall back to current status as a safety net
      setVerifyState('blocked')
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setError(null)
    setCandidateToDelete(null)
    setVerifyState('idle')
  }

  const handleConfirm = async () => {
    if (!candidateToDelete || verifyState !== 'ready') return

    try {
      setError(null)
      setIsLoading(true)

      await deleteCandidate(candidateToDelete.id)

      handleClose()
      onSuccess?.()
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError(err instanceof Error ? err.message : 'Failed to delete candidate')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isOpen,
    isLoading,
    verifyState,
    error,
    candidateToDelete,
    handleOpen,
    handleClose,
    handleConfirm,
  }
}
