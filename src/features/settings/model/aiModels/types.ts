import type { Dispatch, SetStateAction } from 'react'
import type { AIModelConfiguration, AIModelProvider } from '@/entities/ai-model'

export interface AIModelFormData {
  provider: AIModelProvider | ''
  apiKey: string
  modelName: string
  description: string
  isActive: boolean
  centerId: string
}

export const EMPTY_AI_MODEL_FORM: AIModelFormData = {
  provider: '',
  apiKey: '',
  modelName: '',
  description: '',
  isActive: true,
  centerId: '',
}

export interface AIModelsController {
  aiModels: AIModelConfiguration[]
  formData: AIModelFormData
  setFormData: Dispatch<SetStateAction<AIModelFormData>>
  editingId: string | null
  isCreating: boolean
  handleCreate: () => void
  handleEdit: (model: AIModelConfiguration) => void
  handleSave: () => void
  handleCancel: () => void
  handleDelete: (id: string, provider: AIModelProvider) => void
  reload: () => void
}
