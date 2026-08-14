import { useCallback, useEffect, useState } from 'react'
import type { AIModelConfiguration } from '@/entities/ai-model'
import type { Center } from '@/entities/center'
import { createHandleCancel } from './handlers/createHandleCancel'
import { createHandleCreate } from './handlers/createHandleCreate'
import { createHandleDelete } from './handlers/createHandleDelete'
import { createHandleEdit } from './handlers/createHandleEdit'
import { createHandleSave } from './handlers/createHandleSave'
import { createLoadAIModels } from './handlers/createLoadAIModels'
import {
  EMPTY_AI_MODEL_FORM,
  type AIModelFormData,
  type AIModelsController,
} from './types'

export function useAIModels(centers: Center[]): AIModelsController {
  const [aiModels, setAiModels] = useState<AIModelConfiguration[]>([])
  const [formData, setFormData] = useState<AIModelFormData>({ ...EMPTY_AI_MODEL_FORM })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const reload = useCallback(() => createLoadAIModels(setAiModels)(), [setAiModels])

  useEffect(() => {
    void reload()
  }, [reload])

  const handleCreate = useCallback(
    () => createHandleCreate(setIsCreating, setFormData, centers)(),
    [setIsCreating, setFormData, centers]
  )

  const handleEdit = useCallback(
    (model: AIModelConfiguration) => createHandleEdit(setEditingId, setFormData)(model),
    [setEditingId, setFormData]
  )

  const handleSave = useCallback(
    () =>
      createHandleSave({
        formData,
        isCreating,
        editingId,
        setIsCreating,
        setEditingId,
        setFormData,
        reload,
      })(),
    [formData, isCreating, editingId, setIsCreating, setEditingId, setFormData, reload]
  )

  const handleCancel = useCallback(
    () => createHandleCancel(setIsCreating, setEditingId, setFormData)(),
    [setIsCreating, setEditingId, setFormData]
  )

  const handleDelete = useCallback(
    (id: string, provider: AIModelConfiguration['provider']) => createHandleDelete(reload)(id, provider),
    [reload]
  )

  return {
    aiModels,
    formData,
    setFormData,
    editingId,
    isCreating,
    handleCreate,
    handleEdit,
    handleSave,
    handleCancel,
    handleDelete,
    reload,
  }
}
