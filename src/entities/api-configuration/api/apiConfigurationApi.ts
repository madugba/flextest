import { apiClient } from '@/shared/api/client'
import type { APIConfiguration, CreateAPIConfigurationRequest, UpdateAPIConfigurationRequest } from '../model/types'

/**
 * Get all API configurations with optional center filter
 */
export async function getAllAPIConfigurations(centerId?: string): Promise<APIConfiguration[]> {
  const params = centerId ? { centerId } : {}
  const response = await apiClient.get('/api-configurations', { params })
  return response.data as APIConfiguration[]
}

/**
 * Get API configuration by ID
 */
export async function getAPIConfigurationById(id: string): Promise<APIConfiguration> {
  const response = await apiClient.get(`/api-configurations/${id}`)
  return response.data as APIConfiguration
}

/**
 * Get API configurations by center ID
 */
export async function getAPIConfigurationsByCenterId(centerId: string): Promise<APIConfiguration[]> {
  const response = await apiClient.get(`/api-configurations/by-center/${centerId}`)
  return response.data as APIConfiguration[]
}

/**
 * Create a new API configuration
 */
export async function createAPIConfiguration(data: CreateAPIConfigurationRequest): Promise<APIConfiguration> {
  const response = await apiClient.post('/api-configurations', data)
  return response.data as APIConfiguration
}

/**
 * Update API configuration
 */
export async function updateAPIConfiguration(
  id: string,
  data: UpdateAPIConfigurationRequest
): Promise<APIConfiguration> {
  const response = await apiClient.put(`/api-configurations/${id}`, data)
  return response.data as APIConfiguration
}

/**
 * Delete API configuration
 */
export async function deleteAPIConfiguration(id: string): Promise<void> {
  await apiClient.delete(`/api-configurations/${id}`)
}
