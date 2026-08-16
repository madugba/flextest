'use client'

import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type {
  PreviewScoreResponse,
  ValidateFormulaResponse,
} from '@/entities/score-configuration'
import { EMPTY_SCORE_FORM, type ScoreFormData } from './types'

export interface ScoreConfigurationState {
  editingScoreId: string | null
  setEditingScoreId: Dispatch<SetStateAction<string | null>>
  scoreForm: ScoreFormData
  setScoreForm: Dispatch<SetStateAction<ScoreFormData>>
  validationResult: ValidateFormulaResponse | null
  setValidationResult: Dispatch<SetStateAction<ValidateFormulaResponse | null>>
  previewResult: PreviewScoreResponse | null
  setPreviewResult: Dispatch<SetStateAction<PreviewScoreResponse | null>>
}

export function useScoreConfigurationState(): ScoreConfigurationState {
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null)
  const [scoreForm, setScoreForm] = useState<ScoreFormData>({ ...EMPTY_SCORE_FORM })
  const [validationResult, setValidationResult] = useState<ValidateFormulaResponse | null>(null)
  const [previewResult, setPreviewResult] = useState<PreviewScoreResponse | null>(null)

  return {
    editingScoreId,
    setEditingScoreId,
    scoreForm,
    setScoreForm,
    validationResult,
    setValidationResult,
    previewResult,
    setPreviewResult,
  }
}
