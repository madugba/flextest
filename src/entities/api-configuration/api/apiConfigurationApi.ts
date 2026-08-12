import { apiClient } from '@/shared/api/client'
import type { APIConfiguration, CreateAPIConfigurationRequest, UpdateAPIConfigurationRequest } from '../model/types'

// ---------------------------------------------------------------------------
// Brace encoding helpers
//
// The backend validates apiEndpoint with @IsUrl(), which rejects { and }.
// We percent-encode braces before sending and decode them on read so the rest
// of the app can use {placeholder} templates without ever seeing %7B/%7D.
// ---------------------------------------------------------------------------
function encodeEndpoint(url: string): string {
  return url.replace(/\{/g, '%7B').replace(/\}/g, '%7D')
}

function decodeEndpoint(url: string): string {
  return url.replace(/%7B/gi, '{').replace(/%7D/gi, '}')
}

function decodeConfig(config: APIConfiguration): APIConfiguration {
  return { ...config, apiEndpoint: decodeEndpoint(config.apiEndpoint) }
}

/**
 * Get all API configurations with optional center filter
 */
export async function getAllAPIConfigurations(centerId?: string): Promise<APIConfiguration[]> {
  const params = centerId ? { centerId } : {}
  const response = await apiClient.get('/api-configurations', { params })
  return (response.data as APIConfiguration[]).map(decodeConfig)
}

/**
 * Get API configuration by ID
 */
export async function getAPIConfigurationById(id: string): Promise<APIConfiguration> {
  const response = await apiClient.get(`/api-configurations/${id}`)
  return decodeConfig(response.data as APIConfiguration)
}

/**
 * Get API configurations by center ID
 */
export async function getAPIConfigurationsByCenterId(centerId: string): Promise<APIConfiguration[]> {
  const response = await apiClient.get(`/api-configurations/by-center/${centerId}`)
  return (response.data as APIConfiguration[]).map(decodeConfig)
}

/**
 * Create a new API configuration
 */
export async function createAPIConfiguration(data: CreateAPIConfigurationRequest): Promise<APIConfiguration> {
  const payload = { ...data, apiEndpoint: encodeEndpoint(data.apiEndpoint) }
  const response = await apiClient.post('/api-configurations', payload)
  return decodeConfig(response.data as APIConfiguration)
}

/**
 * Update API configuration
 */
export async function updateAPIConfiguration(
  id: string,
  data: UpdateAPIConfigurationRequest
): Promise<APIConfiguration> {
  const payload = {
    ...data,
    ...(data.apiEndpoint !== undefined && { apiEndpoint: encodeEndpoint(data.apiEndpoint) }),
  }
  const response = await apiClient.put(`/api-configurations/${id}`, payload)
  return decodeConfig(response.data as APIConfiguration)
}

/**
 * Delete API configuration
 */
export async function deleteAPIConfiguration(id: string): Promise<void> {
  await apiClient.delete(`/api-configurations/${id}`)
}
