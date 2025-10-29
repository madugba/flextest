import { apiClient, ApiError } from './client'

export interface Center {
  id: string
  centerName: string
  address: string
  phone: string
  email: string
  state: string
  lga: string
  createdAt: string
  updatedAt: string
}

/**
 * Check if center exists in the system
 * @returns Array of centers (empty if no centers exist)
 * @throws ApiError on any API error
 */
export async function getCenters(): Promise<Center[]> {
  try {
    const response = await apiClient.get<Center[]>('/centers')
   
    if (!response.success) {
      throw new ApiError(
        response.error?.message || 'Failed to fetch centers',
        response.error?.code,
        undefined,
        response.error?.details
      )
    }

    return response.data || []
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
 * Check if a center exists and handle redirects
 * Returns true if centers exist, redirects otherwise
 * - Empty array [] → redirects to /onboarding
 * - Any error → redirects to /error
 */
export async function checkCenterExistsWithRedirect(): Promise<boolean> {
  if (typeof window === 'undefined') {
    // Server-side: just return false, let middleware handle it
    return false
  }

  try {
    const centers = await getCenters()

    // If empty array, redirect to onboarding
    if (centers.length === 0) {
      window.location.href = '/onboarding'
      return false
    }

    return true
  } catch {
    // Any error, redirect to error page
    window.location.href = '/error'
    return false
  }
}

/**
 * Get center by ID
 * @param id Center ID
 * @returns Center details
 * @throws ApiError on any API error
 */
export async function getCenterById(id: string): Promise<Center> {
  try {
    const response = await apiClient.get<Center>(`/centers/${id}`)

    if (!response.success || !response.data) {
      throw new ApiError(
        response.error?.message || 'Center not found',
        response.error?.code || 'NOT_FOUND',
        404,
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
 * @param data Center data
 * @returns Created center
 * @throws ApiError on any API error
 */
export async function createCenter(data: Omit<Center, 'id' | 'createdAt' | 'updatedAt'>): Promise<Center> {
  try {
    const response = await apiClient.post<Center>('/centers', data)

    if (!response.success || !response.data) {
      throw new ApiError(
        response.error?.message || 'Failed to create center',
        response.error?.code,
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
 * @param data Partial center data to update
 * @returns Updated center
 * @throws ApiError on any API error
 */
export async function updateCenter(
  id: string,
  data: Partial<Omit<Center, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Center> {
  try {
    const response = await apiClient.patch<Center>(`/centers/${id}`, data)

    if (!response.success || !response.data) {
      throw new ApiError(
        response.error?.message || 'Failed to update center',
        response.error?.code,
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
