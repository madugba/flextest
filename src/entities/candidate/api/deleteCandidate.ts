import { apiClient, ApiError } from '@/shared/api/client'

/**
 * Delete candidate
 * @param id Candidate ID
 * @throws ApiError on not found or server error
 */
export async function deleteCandidate(id: string): Promise<void> {
  try {
    const response = await apiClient.delete<{ message: string }>(
      `/candidates/${encodeURIComponent(id)}`
    )

    if (!response.success) {
      throw new ApiError(
        response.error?.message || 'Failed to delete candidate',
        response.error?.code || 'DELETE_FAILED',
        undefined,
        response.error?.details
      )
    }
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
