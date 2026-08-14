import { useEffect, useState } from 'react'
import type { Candidate, UpdateCandidateRequest } from '@/entities/candidate'
import { getAllSubjects, type Subject } from '@/entities/subject'
import { createHandleClose } from './handlers/createHandleClose'
import { createHandleOpen } from './handlers/createHandleOpen'
import { createHandleSubmit } from './handlers/createHandleSubmit'
import { createHandleToggleSubject } from './handlers/createHandleToggleSubject'

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

  const handleOpen = createHandleOpen({
    setIsOpen,
    setIsFetching,
    setError,
    setCandidate,
    setSelectedSubjects,
    setFormData,
  })

  const handleClose = createHandleClose({
    setIsOpen,
    setCandidate,
    setError,
    setSelectedSubjects,
    setFormData,
  })

  const handleSubmit = createHandleSubmit({
    candidate,
    formData,
    selectedSubjects,
    setError,
    setIsLoading,
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
