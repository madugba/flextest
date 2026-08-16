'use client'

import { useCallback, useState } from 'react'
import {
  useAIModelsQuery,
  useCreateAIModelMutation,
  useUpdateAIModelMutation,
  useDeleteAIModelMutation,
  type AIModelConfiguration,
} from '@/entities/ai-model'
import type { Center } from '@/entities/center'
import { createHandleCancel } from './handlers/createHandleCancel'
import { createHandleCreate } from './handlers/createHandleCreate'
import { createHandleDelete } from './handlers/createHandleDelete'
import { createHandleEdit } from './handlers/createHandleEdit'
import { createHandleSave } from './handlers/createHandleSave'
import {
  EMPTY_AI_MODEL_FORM,
  type AIModelFormData,
  type AIModelsController,
} from './types'

export function useAIModels(centers: Center[]): AIModelsController {
  const [formData, setFormData] = useState<AIModelFormData>({ ...EMPTY_AI_MODEL_FORM })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const query = useAIModelsQuery()
  const createMutation = useCreateAIModelMutation()
  const updateMutation = useUpdateAIModelMutation()
  const deleteMutation = useDeleteAIModelMutation()

  const aiModels = query.data ?? []

  const reload = useCallback(() => {
    void query.refetch()
  }, [query])

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
        createMutation,
        updateMutation,
      })(),
    [
      formData,
      isCreating,
      editingId,
      setIsCreating,
      setEditingId,
      setFormData,
      createMutation,
      updateMutation,
    ]
  )

  const handleCancel = useCallback(
    () => createHandleCancel(setIsCreating, setEditingId, setFormData)(),
    [setIsCreating, setEditingId, setFormData]
  )

  const handleDelete = useCallback(
    (id: string, provider: AIModelConfiguration['provider']) =>
      createHandleDelete(deleteMutation)(id, provider),
    [deleteMutation]
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
