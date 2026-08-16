import type { Dispatch, SetStateAction } from 'react'
import {
  useUpdateCandidateMutation,
  type Candidate,
  type UpdateCandidateRequest,
} from '@/entities/candidate'
import { buildUpdateRequest } from '../selectors/buildUpdateRequest'
import { getCandidateEditErrorMessage } from '../selectors/getCandidateEditErrorMessage'
import { validateSelectedSubjects } from '../selectors/validateSelectedSubjects'

interface CreateHandleSubmitDeps {
  candidate: Candidate | null
  formData: UpdateCandidateRequest
  selectedSubjects: string[]
  updateMutation: ReturnType<typeof useUpdateCandidateMutation>
  setError: Dispatch<SetStateAction<string | null>>
  handleClose: () => void
  onSuccess?: () => void
}

export function createHandleSubmit({
  candidate,
  formData,
  selectedSubjects,
  updateMutation,
  setError,
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

      await updateMutation.mutateAsync({
        id: candidate.id,
        data: buildUpdateRequest(formData, selectedSubjects),
      })

      handleClose()
      onSuccess?.()
    } catch (err: unknown) {
      setError(getCandidateEditErrorMessage(err, 'Failed to update candidate'))
    }
  }
}
