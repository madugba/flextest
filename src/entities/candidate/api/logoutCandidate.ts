import { apiClient, ApiError } from '@/shared/api/client'

/**
 * Logout a candidate from their current session
 * @param candidateId - The candidate ID to logout
 * @param reason - Optional reason for logout
 * @returns Logout result with candidateId and message
 * @throws ApiError on not found or server error
 */
export async function logoutCandidate(
  candidateId: string,
  reason?: string
): Promise<{ candidateId: string; message: string }> {
  try {
    const response = await apiClient.post<{
      candidateId: string
      message: string
    }>(`/candidates/${encodeURIComponent(candidateId)}/logout`, reason ? { reason } : {})

    if (!response.success || !response.data) {
      throw new ApiError(
        response.error?.message || 'Failed to logout candidate',
        response.error?.code || 'LOGOUT_FAILED',
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
