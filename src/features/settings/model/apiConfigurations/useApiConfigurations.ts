'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import {
  useAPIConfigurationsQuery,
  useCreateAPIConfigurationMutation,
  useUpdateAPIConfigurationMutation,
  useDeleteAPIConfigurationMutation,
  type APIConfiguration,
} from '@/entities/api-configuration'
import type { Center } from '@/entities/center'
import { createHandleCancel } from './handlers/createHandleCancel'
import { createHandleCreate } from './handlers/createHandleCreate'
import { createHandleDelete } from './handlers/createHandleDelete'
import { createHandleEdit } from './handlers/createHandleEdit'
import { createHandleSave } from './handlers/createHandleSave'
import {
  EMPTY_API_CONFIGURATION_FORM,
  type APIConfigurationFormData,
  type APIConfigurationsController,
} from './types'

interface UseApiConfigurationsDeps {
  centers: Center[]
  setLoading: Dispatch<SetStateAction<boolean>>
}

export function useApiConfigurations({
  centers,
  setLoading,
}: UseApiConfigurationsDeps): APIConfigurationsController {
  const [formData, setFormData] = useState<APIConfigurationFormData>({
    ...EMPTY_API_CONFIGURATION_FORM,
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const query = useAPIConfigurationsQuery()
  const createMutation = useCreateAPIConfigurationMutation()
  const updateMutation = useUpdateAPIConfigurationMutation()
  const deleteMutation = useDeleteAPIConfigurationMutation()

  const configurations = query.data ?? []

  useEffect(() => {
    if (!query.isLoading) setLoading(false)
  }, [query.isLoading, setLoading])

  const reload = useCallback(() => {
    void query.refetch()
  }, [query])

  const handleCreate = useCallback(
    () => createHandleCreate(setIsCreating, setFormData, centers)(),
    [setIsCreating, setFormData, centers]
  )

  const handleEdit = useCallback(
    (config: APIConfiguration) => createHandleEdit(setEditingId, setFormData)(config),
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
    (id: string, name: string) => createHandleDelete(deleteMutation)(id, name),
    [deleteMutation]
  )

  return {
    configurations,
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
