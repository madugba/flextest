import type { Dispatch, SetStateAction } from 'react'
import type {
  PreviewScoreResponse,
  ValidateFormulaResponse,
} from '@/entities/score-configuration'
import { EMPTY_SCORE_FORM, type ScoreFormData } from '../types'

interface CreateHandleCancelEditDeps {
  setEditingScoreId: Dispatch<SetStateAction<string | null>>
  setScoreForm: Dispatch<SetStateAction<ScoreFormData>>
  setValidationResult: Dispatch<SetStateAction<ValidateFormulaResponse | null>>
  setPreviewResult: Dispatch<SetStateAction<PreviewScoreResponse | null>>
}

export function createHandleCancelEdit({
  setEditingScoreId,
  setScoreForm,
  setValidationResult,
  setPreviewResult,
}: CreateHandleCancelEditDeps) {
  return () => {
    setEditingScoreId(null)
    setScoreForm({ ...EMPTY_SCORE_FORM })
    setValidationResult(null)
    setPreviewResult(null)
  }
}
