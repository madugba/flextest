'use client'

import { useCallback } from 'react'
import type { FormEvent } from 'react'
import type { Center } from '@/entities/center'
import type { ScoreConfiguration } from '@/entities/score-configuration'
import { createHandleCancelEdit } from '../handlers/createHandleCancelEdit'
import { createHandleCreate } from '../handlers/createHandleCreate'
import { createHandleEdit } from '../handlers/createHandleEdit'
import { createHandleUpdate } from '../handlers/createHandleUpdate'
import type { ScoreConfigurationState } from './useScoreConfigurationState'

export function useScoreConfigurationsFormActions(
  state: ScoreConfigurationState,
  reload: () => void,
  centers: Center[]
) {
  const {
    scoreForm,
    setScoreForm,
    editingScoreId,
    setEditingScoreId,
    setValidationResult,
    setPreviewResult,
    setIsCreatingScore,
    setIsUpdatingScore,
  } = state

  const handleCreateScore = useCallback(
    (e: FormEvent) =>
      createHandleCreate({
        scoreForm,
        centers,
        setScoreForm,
        setValidationResult,
        setPreviewResult,
        setIsCreatingScore,
        reload,
      })(e),
    [
      scoreForm,
      centers,
      setScoreForm,
      setValidationResult,
      setPreviewResult,
      setIsCreatingScore,
      reload,
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
        setIsUpdatingScore,
        reload,
      })(e),
    [
      scoreForm,
      editingScoreId,
      setEditingScoreId,
      setScoreForm,
      setValidationResult,
      setPreviewResult,
      setIsUpdatingScore,
      reload,
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
