import { useState, useEffect } from 'react'
import { getCandidateById, updateCandidate, type Candidate, type UpdateCandidateRequest } from '@/entities/candidate'
import { getAllSubjects, type Subject } from '@/entities/subject'
import { ApiError } from '@/shared/api/client'

export function useEditCandidate(onSuccess?: () => void) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])

  const [formData, setFormData] = useState<UpdateCandidateRequest>({
    email: '',
    phone: '',
    isActive: true,
    subjects: [],
  })

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const data = await getAllSubjects()
        setSubjects(data)
      } catch (err) {
        console.error('Failed to load subjects:', err)
      }
    }
    loadSubjects()
  }, [])

  useEffect(() => {
    setFormData(prev => ({ ...prev, subjects: selectedSubjects }))
  }, [selectedSubjects])

  const handleOpen = async (candidateId: string) => {
    try {
      setIsOpen(true)
      setIsFetching(true)
      setError(null)

      const data = await getCandidateById(candidateId)
      setCandidate(data)

      const currentSubjects = data.subjectCombinations?.map(combo => combo.subject.id) || []
      setSelectedSubjects(currentSubjects)

      setFormData({
        email: data.email || '',
        phone: data.phone || '',
        isActive: data.isActive,
        subjects: currentSubjects,
      })
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load candidate')
      }
    } finally {
      setIsFetching(false)
    }
  }

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

  const handleClose = () => {
    setIsOpen(false)
    setCandidate(null)
    setError(null)
    setSelectedSubjects([])
    setFormData({
      email: '',
      phone: '',
      isActive: true,
      subjects: [],
    })
  }

  const handleSubmit = async () => {
    if (!candidate) return

    if (selectedSubjects.length === 0) {
      setError('Please select at least one subject')
      return
    }

    if (selectedSubjects.length > 6) {
      setError('Maximum of 6 subjects allowed')
      return
    }

    try {
      setError(null)
      setIsLoading(true)

      const submitData: UpdateCandidateRequest = {
        email: formData.email?.trim() || undefined,
        phone: formData.phone?.trim() || undefined,
        isActive: formData.isActive,
        subjects: selectedSubjects,
      }

      await updateCandidate(candidate.id, submitData)

      handleClose()
      onSuccess?.()
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError(err instanceof Error ? err.message : 'Failed to update candidate')
      }
    } finally {
      setIsLoading(false)
    }
  }

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
