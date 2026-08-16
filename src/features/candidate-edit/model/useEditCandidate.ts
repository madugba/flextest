'use client'

import { useEffect, useState } from 'react'
import type { UpdateCandidateRequest } from '@/entities/candidate'
import { useCandidateQuery, useUpdateCandidateMutation } from '@/entities/candidate'
import { useSubjectsForSessionQuery } from '@/entities/subject'
import { createHandleClose } from './handlers/createHandleClose'
import { createHandleSubmit } from './handlers/createHandleSubmit'
import { createHandleToggleSubject } from './handlers/createHandleToggleSubject'

export function useEditCandidate(onSuccess?: () => void) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [candidateId, setCandidateId] = useState<string | null>(null)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])

  const [formData, setFormData] = useState<UpdateCandidateRequest>({
    email: '',
    phone: '',
    isActive: true,
    subjects: [],
  })

  const candidateQuery = useCandidateQuery(candidateId || undefined)
  const candidate = candidateQuery.data ?? null
  const isFetching = candidateQuery.isFetching

  const subjectsQuery = useSubjectsForSessionQuery(candidate?.sessionId || undefined)
  const subjects = subjectsQuery.data ?? []

  const updateMutation = useUpdateCandidateMutation()
  const isLoading = updateMutation.isPending

  useEffect(() => {
    if (!isOpen || !candidate) return
    const currentSubjects = candidate.subjectCombinations?.map(combo => combo.subject.id) || []
    setSelectedSubjects(currentSubjects)
    setFormData({
      email: candidate.email || '',
      phone: candidate.phone || '',
      isActive: candidate.isActive,
      subjects: currentSubjects,
    })
  }, [isOpen, candidate])

  useEffect(() => {
    setFormData(prev => ({ ...prev, subjects: selectedSubjects }))
  }, [selectedSubjects])

  const handleOpen = (candidateIdToOpen: string) => {
    setCandidateId(candidateIdToOpen)
    setIsOpen(true)
    setError(null)
    setSelectedSubjects([])
    setFormData({ email: '', phone: '', isActive: true, subjects: [] })
  }

  const handleClose = createHandleClose({
    setIsOpen,
    setCandidateId,
    setError,
    setSelectedSubjects,
    setFormData,
  })

  const handleSubmit = createHandleSubmit({
    candidate,
    formData,
    selectedSubjects,
    updateMutation,
    setError,
    handleClose,
    onSuccess,
  })

  const toggleSubject = createHandleToggleSubject({ setSelectedSubjects })

  return {
    isOpen,
    isLoading,
    isFetching,
    error,
    candidate,
    formData,
    setFormData,
    subjects,
    selectedSubjects,
    toggleSubject,
    handleOpen,
    handleClose,
    handleSubmit,
  }
}
