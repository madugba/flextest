import type { Dispatch, SetStateAction } from 'react'
import { getCandidateById, type Candidate, type UpdateCandidateRequest } from '@/entities/candidate'
import { getCandidateEditErrorMessage } from '../selectors/getCandidateEditErrorMessage'

interface CreateHandleOpenDeps {
  setIsOpen: Dispatch<SetStateAction<boolean>>
  setIsFetching: Dispatch<SetStateAction<boolean>>
  setError: Dispatch<SetStateAction<string | null>>
  setCandidate: Dispatch<SetStateAction<Candidate | null>>
  setSelectedSubjects: Dispatch<SetStateAction<string[]>>
  setFormData: Dispatch<SetStateAction<UpdateCandidateRequest>>
}

export function createHandleOpen({
  setIsOpen,
  setIsFetching,
  setError,
  setCandidate,
  setSelectedSubjects,
  setFormData,
}: CreateHandleOpenDeps) {
  return async (candidateId: string) => {
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
      setError(getCandidateEditErrorMessage(err, 'Failed to load candidate'))
    } finally {
      setIsFetching(false)
    }
  }
}
