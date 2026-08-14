import type { Dispatch, SetStateAction } from 'react'
import type { AIModelConfiguration } from '@/entities/ai-model'
import type { AIModelFormData } from '../types'

export function createHandleEdit(
  setEditingId: Dispatch<SetStateAction<string | null>>,
  setFormData: Dispatch<SetStateAction<AIModelFormData>>
) {
  return (model: AIModelConfiguration) => {
    setEditingId(model.id)
    setFormData({
      provider: model.provider,
      apiKey: model.apiKey,
      modelName: model.modelName || '',
      description: model.description || '',
      isActive: model.isActive,
      centerId: model.centerId,
    })
  }
}
