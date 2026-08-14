import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Center } from '@/entities/center'
import type {
  PreviewScoreResponse,
  ScoreConfiguration,
  ValidateFormulaResponse,
} from '@/entities/score-configuration'
import { createHandleActivate } from './handlers/createHandleActivate'
import { createHandleCancelEdit } from './handlers/createHandleCancelEdit'
import { createHandleCreate } from './handlers/createHandleCreate'
import { createHandleDelete } from './handlers/createHandleDelete'
import { createHandleEdit } from './handlers/createHandleEdit'
import { createHandlePreviewScore } from './handlers/createHandlePreviewScore'
import { createHandleUpdate } from './handlers/createHandleUpdate'
import { createHandleValidateFormula } from './handlers/createHandleValidateFormula'
import { createLoadScoreConfigurations } from './handlers/createLoadScoreConfigurations'
import { EMPTY_SCORE_FORM, type ScoreConfigurationsController, type ScoreFormData } from './types'

export function useScoreConfigurations(centers: Center[]): ScoreConfigurationsController {
  const [scoreConfigurations, setScoreConfigurations] = useState<ScoreConfiguration[]>([])
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null)
  const [scoreForm, setScoreForm] = useState<ScoreFormData>({ ...EMPTY_SCORE_FORM })
  const [validationResult, setValidationResult] = useState<ValidateFormulaResponse | null>(null)
  const [previewResult, setPreviewResult] = useState<PreviewScoreResponse | null>(null)
  const [isLoadingScores, setIsLoadingScores] = useState(false)
  const [scoreError, setScoreError] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [isCreatingScore, setIsCreatingScore] = useState(false)
  const [isUpdatingScore, setIsUpdatingScore] = useState(false)
  const [isActivatingScore, setIsActivatingScore] = useState(false)
  const [isDeletingScore, setIsDeletingScore] = useState(false)

  const reload = useCallback(
    () =>
      createLoadScoreConfigurations(setScoreConfigurations, setIsLoadingScores, setScoreError)(),
    [setScoreConfigurations, setIsLoadingScores, setScoreError]
  )

  useEffect(() => {
    void reload()
  }, [reload])

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
    scoreConfigurations,
    scoreForm,
    setScoreForm,
    editingScoreId,
    validationResult,
    previewResult,
    isLoadingScores,
    scoreError,
    isValidating,
    isPreviewing,
    isCreatingScore,
    isUpdatingScore,
    isActivatingScore,
    isDeletingScore,
    handleCreateScore,
    handleUpdateScore,
    handleEditScore,
    handleCancelEdit,
    handleDeleteScore,
    handleActivateScore,
    handleValidateFormula,
    handlePreviewScore,
    reload,
  }
}
