import { apiClient } from '@/shared/api/client'
import type {
  AIModelConfiguration,
  CreateAIModelRequest,
  UpdateAIModelRequest,
} from '../model/types'

const AI_MODEL_ENDPOINTS = {
  BASE: '/ai-models',
  BY_ID: (id: string) => `/ai-models/${id}`,
} as const

/**
 * Get all AI model configurations
 */
export async function getAllAIModels(): Promise<AIModelConfiguration[]> {
  const response = await apiClient.get<AIModelConfiguration[]>(AI_MODEL_ENDPOINTS.BASE)
  return response.data!
}

/**
 * Get AI model by ID
 */
export async function getAIModelById(id: string): Promise<AIModelConfiguration> {
  const response = await apiClient.get<AIModelConfiguration>(AI_MODEL_ENDPOINTS.BY_ID(id))
  return response.data!
}

/**
 * Create new AI model configuration
 */
export async function createAIModel(data: CreateAIModelRequest): Promise<AIModelConfiguration> {
  const response = await apiClient.post<AIModelConfiguration>(AI_MODEL_ENDPOINTS.BASE, data)
  return response.data!
}

/**
 * Update AI model configuration
 */
export async function updateAIModel(
  id: string,
  data: UpdateAIModelRequest
): Promise<AIModelConfiguration> {
  const response = await apiClient.patch<AIModelConfiguration>(
    AI_MODEL_ENDPOINTS.BY_ID(id),
    data
  )
  return response.data!
}

/**
 * Delete AI model configuration
 */
export async function deleteAIModel(id: string): Promise<void> {
  await apiClient.delete(AI_MODEL_ENDPOINTS.BY_ID(id))
}
