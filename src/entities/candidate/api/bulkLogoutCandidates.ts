import { apiClient, ApiError } from '@/shared/api/client'

/**
 * Bulk logout multiple candidates from their current sessions
 * @param candidateIds - Array of candidate IDs to logout
 * @param reason - Optional reason for bulk logout
 * @returns Bulk logout result with success/failed lists
 * @throws ApiError on server error
 */
export async function bulkLogoutCandidates(
  candidateIds: string[],
  reason?: string
): Promise<{
  message: string
  results: {
    successful: string[]
    failed: { candidateId: string; error: string }[]
    totalProcessed: number
  }
}> {
  try {
    const response = await apiClient.post<{
      message: string
      results: {
        successful: string[]
        failed: { candidateId: string; error: string }[]
        totalProcessed: number
      }
    }>('/candidates/bulk-logout', { candidateIds, reason })

    if (!response.success || !response.data) {
      throw new ApiError(
        response.error?.message || 'Failed to perform bulk logout',
        response.error?.code || 'BULK_LOGOUT_FAILED',
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
