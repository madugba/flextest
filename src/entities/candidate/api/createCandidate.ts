import { apiClient, ApiError } from '@/shared/api/client'
import type { Candidate, CreateCandidateRequest } from '../model/types'

/**
 * Create a new candidate
 * @param data Candidate creation data
 * @returns Created candidate
 * @throws ApiError on validation error or conflict
 */
export async function createCandidate(data: CreateCandidateRequest): Promise<Candidate> {
  try {
    const response = await apiClient.post<Candidate>('/candidates', data)

    if (!response.success || !response.data) {
      throw new ApiError(
        response.error?.message || 'Failed to create candidate',
        response.error?.code || 'CREATE_FAILED',
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
