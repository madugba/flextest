import type { Dispatch, SetStateAction } from 'react'
import type {
  PreviewScoreResponse,
  ScoreConfiguration,
  ValidateFormulaResponse,
} from '@/entities/score-configuration'
import type { ScoreFormData } from '../types'

interface CreateHandleEditDeps {
  setEditingScoreId: Dispatch<SetStateAction<string | null>>
  setScoreForm: Dispatch<SetStateAction<ScoreFormData>>
  setValidationResult: Dispatch<SetStateAction<ValidateFormulaResponse | null>>
  setPreviewResult: Dispatch<SetStateAction<PreviewScoreResponse | null>>
}

export function createHandleEdit({
  setEditingScoreId,
  setScoreForm,
  setValidationResult,
  setPreviewResult,
}: CreateHandleEditDeps) {
  return (config: ScoreConfiguration) => {
    setEditingScoreId(config.id)
    setScoreForm({
      name: config.name,
      description: config.description || '',
      formula: config.formula,
      scoringType: config.scoringType,
      negativeMarking: config.negativeMarking,
      negativeMarkValue: config.negativeMarkValue,
      maxScore: config.maxScore,
      passingScore: config.passingScore,
      gradeRanges: config.gradeRanges || {},
    })
    setValidationResult(null)
    setPreviewResult(null)
  }
}
