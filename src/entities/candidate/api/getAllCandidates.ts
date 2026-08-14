import { apiClient, ApiError } from '@/shared/api/client'
import type { CandidateFilters, CandidatePaginationResponse } from '../model/types'

/**
 * Get all candidates with pagination and filters
 * @param filters Pagination and filter options
 * @returns Paginated list of candidates
 * @throws ApiError on server error
 */
export async function getAllCandidates(
  filters?: CandidateFilters
): Promise<CandidatePaginationResponse> {
  try {
    const params = new URLSearchParams()
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.search) params.append('search', filters.search)
    if (filters?.status) params.append('status', filters.status)
    if (filters?.sessionId) params.append('sessionId', filters.sessionId)

    const queryString = params.toString()
    const url = queryString ? `/candidates?${queryString}` : '/candidates'

    const response = await apiClient.get<CandidatePaginationResponse>(url)

    if (!response.success || !response.data) {
      console.error('Failed to fetch candidates:', {
        url,
        error: response.error,
        success: response.success,
        data: response.data,
      })
      throw new ApiError(
        response.error?.message || 'Failed to fetch candidates',
        response.error?.code || 'FETCH_FAILED',
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
