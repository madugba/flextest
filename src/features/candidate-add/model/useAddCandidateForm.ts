import { useCallback, useEffect, useState } from 'react'
import type { CreateCandidateRequest } from '@/entities/candidate'
import type { ExamSession } from '@/entities/exam-session'
import type { Subject } from '@/entities/subject'
import { createHandleSubmit } from './handlers/createHandleSubmit'
import { createLoadData } from './handlers/createLoadData'
import { createToggleSubject } from './handlers/createToggleSubject'

export function useAddCandidateForm(onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessions, setSessions] = useState<ExamSession[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
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

  const loadData = useCallback(
    () => createLoadData({ setSessions, setSubjects })(),
    [setSessions, setSubjects]
  )

  useEffect(() => {
    void loadData()
  }, [loadData])

  useEffect(() => {
    setFormData(prev => ({ ...prev, subjects: selectedSubjects }))
  }, [selectedSubjects])

  const toggleSubject = createToggleSubject({ setSelectedSubjects })

  const handleSubmit = createHandleSubmit({
    formData,
    selectedSubjects,
    setError,
    setIsLoading,
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
