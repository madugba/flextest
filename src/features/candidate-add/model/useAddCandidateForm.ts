'use client'

import { useEffect, useState } from 'react'
import { useCreateCandidateMutation, type CreateCandidateRequest } from '@/entities/candidate'
import { useExamSessionsQuery } from '@/entities/exam-session'
import { useSubjectsForSessionQuery } from '@/entities/subject'
import { createHandleSubmit } from './handlers/createHandleSubmit'
import { createToggleSubject } from './handlers/createToggleSubject'
import { getActiveSessions } from './selectors/getActiveSessions'

export function useAddCandidateForm(onSuccess?: () => void) {
  const [error, setError] = useState<string | null>(null)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])

  const [formData, setFormData] = useState<CreateCandidateRequest>({
    email: '',
    surname: '',
    firstname: '',
    othername: '',
    phone: '',
    sessionId: '',
    picture: '',
    subjects: [],
  })

  const sessionsQuery = useExamSessionsQuery()
  const subjectsQuery = useSubjectsForSessionQuery(formData.sessionId || undefined)
  const createMutation = useCreateCandidateMutation()

  const sessions = getActiveSessions(sessionsQuery.data ?? [])
  const subjects = subjectsQuery.data ?? []

  const isLoading =
    sessionsQuery.isLoading || subjectsQuery.isLoading || createMutation.isPending

  useEffect(() => {
    setFormData(prev => ({ ...prev, subjects: selectedSubjects }))
  }, [selectedSubjects])

  const toggleSubject = createToggleSubject({ setSelectedSubjects })

  const handleSubmit = createHandleSubmit({
    formData,
    selectedSubjects,
    createMutation,
    setError,
    onSuccess,
  })

  return {
    isLoading,
    error,
    formData,
    sessions,
    subjects,
    selectedSubjects,
    setFormData,
    toggleSubject,
    handleSubmit,
  }
}
