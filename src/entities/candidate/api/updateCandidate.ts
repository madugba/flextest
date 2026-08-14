import { apiClient, ApiError } from '@/shared/api/client'
import type { Candidate, UpdateCandidateRequest } from '../model/types'

/**
 * Update candidate information
 * @param id Candidate ID
 * @param data Candidate update data
 * @returns Updated candidate
 * @throws ApiError on not found, validation error, or conflict
 */
export async function updateCandidate(
  id: string,
  data: UpdateCandidateRequest
): Promise<Candidate> {
  try {
    const response = await apiClient.patch<Candidate>(`/candidates/${encodeURIComponent(id)}`, data)

    if (!response.success || !response.data) {
      throw new ApiError(
        response.error?.message || 'Failed to update candidate',
        response.error?.code || 'UPDATE_FAILED',
        undefined,
        response.error?.details
      )
    }

    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      'UNKNOWN_ERROR'
    )
  }
}
