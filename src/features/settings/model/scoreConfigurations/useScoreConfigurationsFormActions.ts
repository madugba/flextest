'use client'

import { useCallback } from 'react'
import type { FormEvent } from 'react'
import type { Center } from '@/entities/center'
import {
  useCreateScoreConfigurationMutation,
  useUpdateScoreConfigurationMutation,
  type ScoreConfiguration,
} from '@/entities/score-configuration'
import { createHandleCancelEdit } from './handlers/createHandleCancelEdit'
import { createHandleCreate } from './handlers/createHandleCreate'
import { createHandleEdit } from './handlers/createHandleEdit'
import { createHandleUpdate } from './handlers/createHandleUpdate'
import type { ScoreConfigurationState } from './useScoreConfigurationState'

export function useScoreConfigurationsFormActions(
  state: ScoreConfigurationState,
  centers: Center[],
  createMutation: ReturnType<typeof useCreateScoreConfigurationMutation>,
  updateMutation: ReturnType<typeof useUpdateScoreConfigurationMutation>
) {
  const {
    scoreForm,
    setScoreForm,
    editingScoreId,
    setEditingScoreId,
    setValidationResult,
    setPreviewResult,
  } = state

  const handleCreateScore = useCallback(
    (e: FormEvent) =>
      createHandleCreate({
        scoreForm,
        centers,
        setScoreForm,
        setValidationResult,
        setPreviewResult,
        createMutation,
      })(e),
    [
      scoreForm,
      centers,
      setScoreForm,
      setValidationResult,
      setPreviewResult,
      createMutation,
    ]
  )

  const handleUpdateScore = useCallback(
    (e: FormEvent) =>
      createHandleUpdate({
        scoreForm,
        editingScoreId,
        setEditingScoreId,
        setScoreForm,
        setValidationResult,
        setPreviewResult,
        updateMutation,
      })(e),
    [
      scoreForm,
      editingScoreId,
      setEditingScoreId,
      setScoreForm,
      setValidationResult,
      setPreviewResult,
      updateMutation,
    ]
  )

  const handleEditScore = useCallback(
    (config: ScoreConfiguration) =>
      createHandleEdit({ setEditingScoreId, setScoreForm, setValidationResult, setPreviewResult })(
        config
      ),
    [setEditingScoreId, setScoreForm, setValidationResult, setPreviewResult]
  )

  const handleCancelEdit = useCallback(
    () =>
      createHandleCancelEdit({ setEditingScoreId, setScoreForm, setValidationResult, setPreviewResult })(
      ),
    [setEditingScoreId, setScoreForm, setValidationResult, setPreviewResult]
  )

  return {
    handleCreateScore,
    handleUpdateScore,
    handleEditScore,
    handleCancelEdit,
  }
}
