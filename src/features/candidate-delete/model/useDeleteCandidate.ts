import { useState } from 'react'
import { deleteCandidate, type Candidate } from '@/entities/candidate'
import { ApiError } from '@/shared/api/client'

export function useDeleteCandidate(onSuccess?: () => void) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null)

  const handleOpen = (candidate: Candidate) => {
    setCandidateToDelete(candidate)
    setIsOpen(true)
    setError(null)
  }

  const handleClose = () => {
    setIsOpen(false)
    setError(null)
    setCandidateToDelete(null)
  }

  const handleConfirm = async () => {
    if (!candidateToDelete) return

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
    error,
    candidateToDelete,
    handleOpen,
    handleClose,
    handleConfirm,
  }
}
