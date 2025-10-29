import { apiClient, ApiError } from './client'

export interface Admin {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  centerId: string | null
  center?: {
    id: string
    name: string
  } | null
  permissions: string[]
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateAdminRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  centerId?: string
  permissions?: string[]
  isActive?: boolean
}

export interface UpdateAdminRequest {
  firstName?: string
  lastName?: string
  centerId?: string | null
  permissions?: string[]
  isActive?: boolean
}

export interface UpdatePasswordRequest {
  currentPassword: string
  newPassword: string
}

/**
 * Get all admins
 * @param options Pagination options
 * @returns List of admins
 * @throws ApiError on server error
 */
export async function getAllAdmins(options?: {
  skip?: number
  take?: number
}): Promise<Admin[]> {
  try {
    const params = new URLSearchParams()
    if (options?.skip !== undefined) params.append('skip', options.skip.toString())
    if (options?.take !== undefined) params.append('take', options.take.toString())

    const queryString = params.toString()
    const url = `/admins${queryString ? `?${queryString}` : ''}`

    const response = await apiClient.get<Admin[]>(url)

    if (!response.success || !response.data) {
      throw new ApiError(
        response.error?.message || 'Failed to fetch admins',
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
 * Get admin by email
 * @param email Admin email
 * @returns Admin details
 * @throws ApiError on not found or server error
 */
export async function getAdminByEmail(email: string): Promise<Admin> {
  try {
    const response = await apiClient.get<Admin>(`/admins/email/${encodeURIComponent(email)}`)

    if (!response.success || !response.data) {
      throw new ApiError(
        response.error?.message || 'Admin not found',
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
 * Create a new admin
 * @param data Admin creation data
 * @returns Created admin
 * @throws ApiError on validation error or conflict
 */
export async function createAdmin(data: CreateAdminRequest): Promise<Admin> {
  try {
    const response = await apiClient.post<Admin>('/admins', data)

    if (!response.success || !response.data) {
      throw new ApiError(
        response.error?.message || 'Failed to create admin',
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
 * Update admin information
 * @param id Admin ID
 * @param data Update data
 * @returns Updated admin
 * @throws ApiError on validation error or not found
 */
export async function updateAdmin(id: string, data: UpdateAdminRequest): Promise<Admin> {
  try {
    const response = await apiClient.patch<Admin>(`/admins/${id}`, data)

    if (!response.success || !response.data) {
      throw new ApiError(
        response.error?.message || 'Failed to update admin',
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
 * Update admin password
 * @param id Admin ID
 * @param data Password update data
 * @returns Updated admin
 * @throws ApiError on validation error, unauthorized, or not found
 */
export async function updateAdminPassword(
  id: string,
  data: UpdatePasswordRequest
): Promise<Admin> {
  try {
    const response = await apiClient.patch<Admin>(`/admins/${id}/password`, data)

    if (!response.success || !response.data) {
      throw new ApiError(
        response.error?.message || 'Failed to update password',
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
 * Delete admin
 * @param id Admin ID
 * @returns Deleted admin
 * @throws ApiError on not found or server error
 */
export async function deleteAdmin(id: string): Promise<Admin> {
  try {
    const response = await apiClient.delete<Admin>(`/admins/${id}`)

    if (!response.success || !response.data) {
      throw new ApiError(
        response.error?.message || 'Failed to delete admin',
        response.error?.code || 'DELETE_FAILED',
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
 * Block admin (set isActive to false)
 * @param id Admin ID
 * @returns Updated admin
 */
export async function blockAdmin(id: string): Promise<Admin> {
  return updateAdmin(id, { isActive: false })
}

/**
 * Unblock admin (set isActive to true)
 * @param id Admin ID
 * @returns Updated admin
 */
export async function unblockAdmin(id: string): Promise<Admin> {
  return updateAdmin(id, { isActive: true })
}
