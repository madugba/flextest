export type AIModelProvider = 'OPENAI' | 'GEMINI' | 'DEEPSEEK'

export interface AIModelConfiguration {
  id: string
  provider: AIModelProvider
  apiKey: string
  modelName?: string
  description?: string
  isActive: boolean
  centerId: string
  createdAt: string
  updatedAt: string
}

export interface CreateAIModelRequest {
  provider: AIModelProvider
  apiKey: string
  modelName?: string
  description?: string
  isActive?: boolean
  centerId: string
}

export interface UpdateAIModelRequest {
  provider?: AIModelProvider
  apiKey?: string
  modelName?: string
  description?: string
  isActive?: boolean
  centerId?: string
}
