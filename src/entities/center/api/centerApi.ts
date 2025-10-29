import { apiClient, ApiError } from '@/shared/api/client'
import type { Center, CreateCenterRequest, UpdateCenterRequest } from '../model/types'

/**
 * Get all centers
 * @returns List of centers
 * @throws ApiError on server error
 */
export async function getAllCenters(): Promise<Center[]> {
  try {
    const response = await apiClient.get<Center[]>('/centers')

    if (!response.success || !response.data) {
      throw new ApiError(
        response.error?.message || 'Failed to fetch centers',
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
 * Get center by ID
 * @param id Center ID
 * @returns Center details
 * @throws ApiError on not found or server error
 */
export async function getCenterById(id: string): Promise<Center> {
  try {
    const response = await apiClient.get<Center>(`/centers/${id}`)

    if (!response.success || !response.data) {
      throw new ApiError(
        response.error?.message || 'Center not found',
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
 * Create a new center
 * @param data Center creation data
 * @returns Created center
 * @throws ApiError on validation error or conflict
 */
export async function createCenter(data: CreateCenterRequest): Promise<Center> {
  try {
    const response = await apiClient.post<Center>('/centers', data)

    if (!response.success || !response.data) {
      throw new ApiError(
        response.error?.message || 'Failed to create center',
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
 * Update center information
 * @param id Center ID
 * @param data Update data
 * @returns Updated center
 * @throws ApiError on validation error or not found
 */
export async function updateCenter(id: string, data: UpdateCenterRequest): Promise<Center> {
  try {
    const response = await apiClient.patch<Center>(`/centers/${id}`, data)

    if (!response.success || !response.data) {
      throw new ApiError(
        response.error?.message || 'Failed to update center',
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
