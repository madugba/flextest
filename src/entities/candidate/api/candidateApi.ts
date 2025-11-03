import { apiClient, ApiError } from '@/shared/api/client'
import type {
  Candidate,
  CreateCandidateRequest,
  UpdateCandidateRequest,
  CandidatePaginationResponse,
  CandidateFilters,
  ImportCandidatesRequest,
} from '../model/types'

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

/**
 * Get candidate by ID
 * @param id Candidate ID
 * @returns Candidate details
 * @throws ApiError on not found or server error
 */
export async function getCandidateById(id: string): Promise<Candidate> {
  try {
    const response = await apiClient.get<Candidate>(`/candidates/${id}`)

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
    const response = await apiClient.patch<Candidate>(`/candidates/${id}`, data)

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

/**
 * Delete candidate
 * @param id Candidate ID
 * @throws ApiError on not found or server error
 */
export async function deleteCandidate(id: string): Promise<void> {
  try {
    const response = await apiClient.delete<{ message: string }>(`/candidates/${id}`)

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

/**
 * Import candidates in bulk
 * @param data Import candidates request
 * @returns Import result with success/failed counts and errors
 * @throws ApiError on validation error or server error
 */
export async function importCandidates(
  data: ImportCandidatesRequest
): Promise<{
  message: string
  success: number
  failed: number
  errors: Array<{ index: number; error: string }>
}> {
  try {
    const response = await apiClient.post<{
      message: string
      success: number
      failed: number
      errors: Array<{ index: number; error: string }>
    }>(
      '/candidates/import',
      data
    )

    if (!response.success || !response.data) {
      throw new ApiError(
        response.error?.message || 'Failed to import candidates',
        response.error?.code || 'IMPORT_FAILED',
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
    }>(
      `/candidates/${candidateId}/logout`,
      reason ? { reason } : {}
    )

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
    }>(
      '/candidates/bulk-logout',
      { candidateIds, reason }
    )

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
