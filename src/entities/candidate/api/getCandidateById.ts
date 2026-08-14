import { apiClient, ApiError } from '@/shared/api/client'
import type { Candidate } from '../model/types'

/**
 * Get candidate by ID
 * @param id Candidate ID
 * @returns Candidate details
 * @throws ApiError on not found or server error
 */
export async function getCandidateById(id: string): Promise<Candidate> {
  try {
    const response = await apiClient.get<Candidate>(`/candidates/${encodeURIComponent(id)}`)

    if (!response.success || !response.data) {
      throw new ApiError(
        response.error?.message || 'Candidate not found',
        response.error?.code || 'NOT_FOUND',
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
