import type { Dispatch, SetStateAction } from 'react'
import type { Candidate, UpdateCandidateRequest } from '@/entities/candidate'

interface CreateHandleCloseDeps {
  setIsOpen: Dispatch<SetStateAction<boolean>>
  setCandidate: Dispatch<SetStateAction<Candidate | null>>
  setError: Dispatch<SetStateAction<string | null>>
  setSelectedSubjects: Dispatch<SetStateAction<string[]>>
  setFormData: Dispatch<SetStateAction<UpdateCandidateRequest>>
}

export function createHandleClose({
  setIsOpen,
  setCandidate,
  setError,
  setSelectedSubjects,
  setFormData,
}: CreateHandleCloseDeps) {
  return () => {
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
}
