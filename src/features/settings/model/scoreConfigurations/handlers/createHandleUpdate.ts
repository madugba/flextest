import type { Dispatch, FormEvent, SetStateAction } from 'react'
import { toast } from 'sonner'
import {
  updateScoreConfiguration,
  type PreviewScoreResponse,
  type UpdateScoreConfigurationRequest,
  type ValidateFormulaResponse,
} from '@/entities/score-configuration'
import { getErrorMessage } from '../../shared/selectors/getErrorMessage'
import { EMPTY_SCORE_FORM, type ScoreFormData } from '../types'

interface CreateHandleUpdateDeps {
  scoreForm: ScoreFormData
  editingScoreId: string | null
  setEditingScoreId: Dispatch<SetStateAction<string | null>>
  setScoreForm: Dispatch<SetStateAction<ScoreFormData>>
  setValidationResult: Dispatch<SetStateAction<ValidateFormulaResponse | null>>
  setPreviewResult: Dispatch<SetStateAction<PreviewScoreResponse | null>>
  setIsUpdatingScore: Dispatch<SetStateAction<boolean>>
  reload: () => void
}

export function createHandleUpdate({
  scoreForm,
  editingScoreId,
  setEditingScoreId,
  setScoreForm,
  setValidationResult,
  setPreviewResult,
  setIsUpdatingScore,
  reload,
}: CreateHandleUpdateDeps) {
  return async (e: FormEvent) => {
    e.preventDefault()
    if (!editingScoreId) return

    setIsUpdatingScore(true)

    try {
      const updateData: UpdateScoreConfigurationRequest = {
        name: scoreForm.name.trim(),
        description: scoreForm.description?.trim() || undefined,
        formula: scoreForm.formula.trim(),
        scoringType: scoreForm.scoringType,
        gradeRanges: Object.keys(scoreForm.gradeRanges).length > 0 ? scoreForm.gradeRanges : undefined,
        negativeMarking: scoreForm.negativeMarking,
        negativeMarkValue: scoreForm.negativeMarkValue,
        passingScore: scoreForm.passingScore,
        maxScore: scoreForm.maxScore,
      }

      await updateScoreConfiguration(editingScoreId, updateData)
      toast.success('Score configuration updated successfully')

      setEditingScoreId(null)
      setScoreForm({ ...EMPTY_SCORE_FORM })
      setValidationResult(null)
      setPreviewResult(null)
      await reload()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to update score configuration'))
    } finally {
      setIsUpdatingScore(false)
    }
  }
}
