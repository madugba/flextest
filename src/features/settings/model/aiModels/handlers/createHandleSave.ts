import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import {
  type AIModelProvider,
  useCreateAIModelMutation,
  useUpdateAIModelMutation,
  type CreateAIModelRequest,
  type UpdateAIModelRequest,
} from '@/entities/ai-model'
import { getApiErrorMessage } from '../../shared/selectors/getApiErrorMessage'
import { EMPTY_AI_MODEL_FORM, type AIModelFormData } from '../types'

interface CreateHandleSaveDeps {
  formData: AIModelFormData
  isCreating: boolean
  editingId: string | null
  setIsCreating: Dispatch<SetStateAction<boolean>>
  setEditingId: Dispatch<SetStateAction<string | null>>
  setFormData: Dispatch<SetStateAction<AIModelFormData>>
  createMutation: ReturnType<typeof useCreateAIModelMutation>
  updateMutation: ReturnType<typeof useUpdateAIModelMutation>
}

export function createHandleSave({
  formData,
  isCreating,
  editingId,
  setIsCreating,
  setEditingId,
  setFormData,
  createMutation,
  updateMutation,
}: CreateHandleSaveDeps) {
  return async () => {
    try {
      if (!formData.provider || !formData.apiKey.trim() || !formData.centerId) {
        toast.error('Provider, API key, and center are required')
        return
      }

      if (isCreating) {
        const newModel: CreateAIModelRequest = {
          provider: formData.provider as AIModelProvider,
          apiKey: formData.apiKey.trim(),
          modelName: formData.modelName.trim() || undefined,
          description: formData.description.trim() || undefined,
          isActive: formData.isActive,
          centerId: formData.centerId,
        }
        await createMutation.mutateAsync(newModel)
        toast.success('AI model added successfully')
      } else if (editingId) {
        const updateData: UpdateAIModelRequest = {
          provider: formData.provider as AIModelProvider,
          apiKey: formData.apiKey.trim(),
          modelName: formData.modelName.trim() || undefined,
          description: formData.description.trim() || undefined,
          isActive: formData.isActive,
          centerId: formData.centerId,
        }
        await updateMutation.mutateAsync({ id: editingId, data: updateData })
        toast.success('AI model updated successfully')
      }

      setIsCreating(false)
      setEditingId(null)
      setFormData({ ...EMPTY_AI_MODEL_FORM })
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        const message = getApiErrorMessage(error)
        if (message) toast.error(message)
      }
    }
  }
}
