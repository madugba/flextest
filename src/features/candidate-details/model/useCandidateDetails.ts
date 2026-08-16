'use client'

import { useState } from 'react'
import { useCandidateQuery } from '@/entities/candidate'

export function useCandidateDetails() {
  const [isOpen, setIsOpen] = useState(false)
  const [candidateId, setCandidateId] = useState<string | null>(null)

  const candidateQuery = useCandidateQuery(candidateId || undefined)
  const candidate = candidateQuery.data ?? null
  const isLoading = candidateQuery.isLoading
  const error = candidateQuery.error?.message ?? null

  const handleOpen = (id: string) => {
    setCandidateId(id)
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    setCandidateId(null)
  }

  return {
    isOpen,
    isLoading,
    error,
    candidate,
    handleOpen,
    handleClose,
  }
}
