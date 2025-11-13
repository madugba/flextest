import { useState, useEffect } from 'react'
import { createCandidate, type CreateCandidateRequest } from '@/entities/candidate'
import { getAllExamSessions, type ExamSession } from '@/entities/exam-session'
import { getAllSubjects, type Subject } from '@/entities/subject'
import { ApiError } from '@/shared/api/client'

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

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sessionsData, subjectsData] = await Promise.all([
          getAllExamSessions(),
          getAllSubjects(),
        ])
        const activeSessionsData = sessionsData.filter(
          session => session.status === 'SCHEDULED' || session.status === 'ACTIVE'
        )
        setSessions(activeSessionsData)
        setSubjects(subjectsData)
      } catch (err) {
        console.error('Failed to load sessions or subjects:', err)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    setFormData(prev => ({ ...prev, subjects: selectedSubjects }))
  }, [selectedSubjects])

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects(prev => {
      if (prev.includes(subjectId)) {
        return prev.filter(id => id !== subjectId)
      } else if (prev.length < 6) {
        return [...prev, subjectId]
      }
      return prev
    })
  }

  const handleSubmit = async () => {
    try {
      setError(null)
      setIsLoading(true)

      if (!formData.surname.trim()) {
        setError('Surname is required')
        return
      }

      if (!formData.firstname.trim()) {
        setError('First name is required')
        return
      }

      if (!formData.sessionId) {
        setError('Please select an exam session')
        return
      }

      if (selectedSubjects.length === 0) {
        setError('Please select at least one subject')
        return
      }

      if (selectedSubjects.length > 6) {
        setError('Maximum of 6 subjects allowed')
        return
      }

      const submitData: CreateCandidateRequest = {
        ...formData,
        subjects: selectedSubjects,
        email: formData.email?.trim() || undefined,
        othername: formData.othername?.trim() || undefined,
        phone: formData.phone?.trim() || undefined,
        picture: formData.picture?.trim() || undefined,
      }

      await createCandidate(submitData)

      onSuccess?.()
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError(err instanceof Error ? err.message : 'Failed to create candidate')
      }
    } finally {
      setIsLoading(false)
    }
  }

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
