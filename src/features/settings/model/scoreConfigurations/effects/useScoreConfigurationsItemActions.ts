'use client'

import { useCallback } from 'react'
import { createHandleActivate } from '../handlers/createHandleActivate'
import { createHandleDelete } from '../handlers/createHandleDelete'
import { createHandlePreviewScore } from '../handlers/createHandlePreviewScore'
import { createHandleValidateFormula } from '../handlers/createHandleValidateFormula'
import type { ScoreConfigurationState } from './useScoreConfigurationState'

export function useScoreConfigurationsItemActions(state: ScoreConfigurationState, reload: () => void) {
  const {
    scoreForm,
    validationResult,
    setValidationResult,
    setPreviewResult,
    setIsDeletingScore,
    setIsActivatingScore,
    setIsValidating,
    setIsPreviewing,
  } = state

  const handleDeleteScore = useCallback(
    (id: string) => createHandleDelete(setIsDeletingScore, reload)(id),
    [setIsDeletingScore, reload]
  )

  const handleActivateScore = useCallback(
    (id: string) => createHandleActivate(setIsActivatingScore, reload)(id),
    [setIsActivatingScore, reload]
  )

  const handleValidateFormula = useCallback(
    () => createHandleValidateFormula(setValidationResult, setIsValidating, scoreForm.formula)(),
    [setValidationResult, setIsValidating, scoreForm.formula]
  )

  const handlePreviewScore = useCallback(
    () =>
      createHandlePreviewScore(setPreviewResult, setIsPreviewing, scoreForm.formula, validationResult)(
      ),
    [setPreviewResult, setIsPreviewing, scoreForm.formula, validationResult]
  )

  return {
    handleDeleteScore,
    handleActivateScore,
    handleValidateFormula,
    handlePreviewScore,
  }
}
