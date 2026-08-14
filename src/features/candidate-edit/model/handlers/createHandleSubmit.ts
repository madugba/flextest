import type { Dispatch, SetStateAction } from 'react'
import { updateCandidate, type Candidate, type UpdateCandidateRequest } from '@/entities/candidate'
import { buildUpdateRequest } from '../selectors/buildUpdateRequest'
import { getCandidateEditErrorMessage } from '../selectors/getCandidateEditErrorMessage'
import { validateSelectedSubjects } from '../selectors/validateSelectedSubjects'

interface CreateHandleSubmitDeps {
  candidate: Candidate | null
  formData: UpdateCandidateRequest
  selectedSubjects: string[]
  setError: Dispatch<SetStateAction<string | null>>
  setIsLoading: Dispatch<SetStateAction<boolean>>
  handleClose: () => void
  onSuccess?: () => void
}

export function createHandleSubmit({
  candidate,
  formData,
  selectedSubjects,
  setError,
  setIsLoading,
  handleClose,
  onSuccess,
}: CreateHandleSubmitDeps) {
  return async () => {
    if (!candidate) return

    const validationError = validateSelectedSubjects(selectedSubjects)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setError(null)
      setIsLoading(true)

      await updateCandidate(candidate.id, buildUpdateRequest(formData, selectedSubjects))

      handleClose()
      onSuccess?.()
    } catch (err: unknown) {
      setError(getCandidateEditErrorMessage(err, 'Failed to update candidate'))
    } finally {
      setIsLoading(false)
    }
  }
}
