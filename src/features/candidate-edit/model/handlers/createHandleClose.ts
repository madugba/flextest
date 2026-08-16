import type { Dispatch, SetStateAction } from 'react'
import type { UpdateCandidateRequest } from '@/entities/candidate'

interface CreateHandleCloseDeps {
  setIsOpen: Dispatch<SetStateAction<boolean>>
  setCandidateId: Dispatch<SetStateAction<string | null>>
  setError: Dispatch<SetStateAction<string | null>>
  setSelectedSubjects: Dispatch<SetStateAction<string[]>>
  setFormData: Dispatch<SetStateAction<UpdateCandidateRequest>>
}

export function createHandleClose({
  setIsOpen,
  setCandidateId,
  setError,
  setSelectedSubjects,
  setFormData,
}: CreateHandleCloseDeps) {
  return () => {
    setIsOpen(false)
    setCandidateId(null)
    setError(null)
    setSelectedSubjects([])
    setFormData({
      email: '',
      phone: '',
      isActive: true,
      subjects: [],
    })
  }
}
