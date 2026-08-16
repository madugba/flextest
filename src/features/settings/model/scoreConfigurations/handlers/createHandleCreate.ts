import type { Dispatch, FormEvent, SetStateAction } from 'react'
import { toast } from 'sonner'
import type { Center } from '@/entities/center'
import {
  useCreateScoreConfigurationMutation,
  type CreateScoreConfigurationRequest,
  type PreviewScoreResponse,
  type ValidateFormulaResponse,
} from '@/entities/score-configuration'
import { getErrorMessage } from '../../shared/selectors/getErrorMessage'
import { EMPTY_SCORE_FORM, type ScoreFormData } from '../types'

interface CreateHandleCreateDeps {
  scoreForm: ScoreFormData
  centers: Center[]
  setScoreForm: Dispatch<SetStateAction<ScoreFormData>>
  setValidationResult: Dispatch<SetStateAction<ValidateFormulaResponse | null>>
  setPreviewResult: Dispatch<SetStateAction<PreviewScoreResponse | null>>
  createMutation: ReturnType<typeof useCreateScoreConfigurationMutation>
}

export function createHandleCreate({
  scoreForm,
  centers,
  setScoreForm,
  setValidationResult,
  setPreviewResult,
  createMutation,
}: CreateHandleCreateDeps) {
  return async (e: FormEvent) => {
    e.preventDefault()

    try {
      const centerId = centers.length > 0 ? centers[0].id : ''
      if (!centerId) {
        toast.error('No center available')
        return
      }

      const newConfig: CreateScoreConfigurationRequest = {
        name: scoreForm.name.trim(),
        description: scoreForm.description?.trim() || undefined,
        formula: scoreForm.formula.trim(),
        scoringType: scoreForm.scoringType,
        gradeRanges: Object.keys(scoreForm.gradeRanges).length > 0 ? scoreForm.gradeRanges : undefined,
        negativeMarking: scoreForm.negativeMarking,
        negativeMarkValue: scoreForm.negativeMarkValue,
        passingScore: scoreForm.passingScore,
        maxScore: scoreForm.maxScore,
        centerId,
      }

      await createMutation.mutateAsync(newConfig)
      toast.success('Score configuration created successfully')

      setScoreForm({ ...EMPTY_SCORE_FORM })
      setValidationResult(null)
      setPreviewResult(null)
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to create score configuration'))
    }
  }
}
