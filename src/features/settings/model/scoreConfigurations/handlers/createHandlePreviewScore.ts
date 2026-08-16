import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import {
  usePreviewScoreMutation,
  type PreviewScoreResponse,
  type ValidateFormulaResponse,
} from '@/entities/score-configuration'

export function createHandlePreviewScore(
  setPreviewResult: Dispatch<SetStateAction<PreviewScoreResponse | null>>,
  previewMutation: ReturnType<typeof usePreviewScoreMutation>,
  formula: string,
  validationResult: ValidateFormulaResponse | null
) {
  return async () => {
    if (!formula.trim()) {
      toast.error('Please enter a formula to preview')
      return
    }

    if (!validationResult?.isValid) {
      toast.error('Please validate the formula first')
      return
    }

    try {
      const sampleValues = validationResult.sampleValues || {
        correctAnswers: 8,
        totalQuestions: 10,
        wrongAnswers: 2,
        skippedQuestions: 0,
      }

      const result = await previewMutation.mutateAsync({
        formula,
        values: sampleValues,
      })

      setPreviewResult(result)
    } catch {
      toast.error('Failed to preview score calculation')
    }
  }
}
