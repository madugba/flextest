import type { Dispatch, SetStateAction } from 'react'
import { useCreateCandidateMutation, type CreateCandidateRequest } from '@/entities/candidate'
import { ApiError } from '@/shared/api/client'
import { getSubmitData } from '../selectors/getSubmitData'
import { getValidationError } from '../selectors/getValidationError'

interface CreateHandleSubmitDeps {
  formData: CreateCandidateRequest
  selectedSubjects: string[]
  createMutation: ReturnType<typeof useCreateCandidateMutation>
  setError: Dispatch<SetStateAction<string | null>>
  onSuccess?: () => void
}

export function createHandleSubmit({
  formData,
  selectedSubjects,
  createMutation,
  setError,
  onSuccess,
}: CreateHandleSubmitDeps) {
  return async () => {
    try {
      setError(null)

      const validationError = getValidationError(formData, selectedSubjects)
      if (validationError) {
        setError(validationError)
        return
      }

      await createMutation.mutateAsync(getSubmitData(formData, selectedSubjects))

      onSuccess?.()
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError(err instanceof Error ? err.message : 'Failed to create candidate')
      }
    }
  }
}
