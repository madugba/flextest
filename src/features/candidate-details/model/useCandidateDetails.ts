import { useState, useEffect } from 'react'
import { getCandidateById, type Candidate } from '@/entities/candidate'
import { ApiError } from '@/shared/api/client'

export function useCandidateDetails() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [candidateId, setCandidateId] = useState<string | null>(null)

  const handleOpen = (id: string) => {
    setCandidateId(id)
    setIsOpen(true)
    setError(null)
  }

  const handleClose = () => {
    setIsOpen(false)
    setError(null)
    setCandidate(null)
    setCandidateId(null)
  }

  useEffect(() => {
    if (!candidateId || !isOpen) return

    const fetchCandidate = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const data = await getCandidateById(candidateId)
        setCandidate(data)
      } catch (err: unknown) {
        if (err instanceof ApiError) {
          setError(err.message)
        } else {
          setError(err instanceof Error ? err.message : 'Failed to fetch candidate details')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchCandidate()
  }, [candidateId, isOpen])

  return {
    isOpen,
    isLoading,
    error,
    candidate,
    handleOpen,
    handleClose,
  }
}
