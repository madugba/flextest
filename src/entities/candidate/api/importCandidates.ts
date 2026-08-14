import { apiClient, ApiError } from '@/shared/api/client'
import type { ImportCandidatesRequest } from '../model/types'

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
    }>('/candidates/import', data)

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
