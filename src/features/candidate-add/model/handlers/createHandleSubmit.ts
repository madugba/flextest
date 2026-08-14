import type { Dispatch, SetStateAction } from 'react'
import { createCandidate, type CreateCandidateRequest } from '@/entities/candidate'
import { ApiError } from '@/shared/api/client'
import { getSubmitData } from '../selectors/getSubmitData'
import { getValidationError } from '../selectors/getValidationError'

interface CreateHandleSubmitDeps {
  formData: CreateCandidateRequest
  selectedSubjects: string[]
  setError: Dispatch<SetStateAction<string | null>>
  setIsLoading: Dispatch<SetStateAction<boolean>>
  onSuccess?: () => void
}

export function createHandleSubmit({
  formData,
  selectedSubjects,
  setError,
  setIsLoading,
  onSuccess,
}: CreateHandleSubmitDeps) {
  return async () => {
    try {
      setError(null)
      setIsLoading(true)

      const validationError = getValidationError(formData, selectedSubjects)
      if (validationError) {
        setError(validationError)
        return
      }

      await createCandidate(getSubmitData(formData, selectedSubjects))

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
}
