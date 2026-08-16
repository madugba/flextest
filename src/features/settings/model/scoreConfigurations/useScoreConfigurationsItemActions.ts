'use client'

import { useCallback } from 'react'
import {
  useActivateScoreConfigurationMutation,
  useDeleteScoreConfigurationMutation,
  usePreviewScoreMutation,
  useValidateFormulaMutation,
} from '@/entities/score-configuration'
import { createHandleActivate } from './handlers/createHandleActivate'
import { createHandleDelete } from './handlers/createHandleDelete'
import { createHandlePreviewScore } from './handlers/createHandlePreviewScore'
import { createHandleValidateFormula } from './handlers/createHandleValidateFormula'
import type { ScoreConfigurationState } from './useScoreConfigurationState'

export function useScoreConfigurationsItemActions(
  state: ScoreConfigurationState,
  activateMutation: ReturnType<typeof useActivateScoreConfigurationMutation>,
  deleteMutation: ReturnType<typeof useDeleteScoreConfigurationMutation>,
  validateMutation: ReturnType<typeof useValidateFormulaMutation>,
  previewMutation: ReturnType<typeof usePreviewScoreMutation>
) {
  const { scoreForm, validationResult, setValidationResult, setPreviewResult } = state

  const handleDeleteScore = useCallback(
    (id: string) => createHandleDelete(deleteMutation)(id),
    [deleteMutation]
  )

  const handleActivateScore = useCallback(
    (id: string) => createHandleActivate(activateMutation)(id),
    [activateMutation]
  )

  const handleValidateFormula = useCallback(
    () => createHandleValidateFormula(setValidationResult, validateMutation, scoreForm.formula)(),
    [setValidationResult, validateMutation, scoreForm.formula]
  )

  const handlePreviewScore = useCallback(
    () =>
      createHandlePreviewScore(
        setPreviewResult,
        previewMutation,
        scoreForm.formula,
        validationResult
      )(),
    [setPreviewResult, previewMutation, scoreForm.formula, validationResult]
  )

  return {
    handleDeleteScore,
    handleActivateScore,
    handleValidateFormula,
    handlePreviewScore,
  }
}
