import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import {
  useValidateFormulaMutation,
  type ValidateFormulaResponse,
} from '@/entities/score-configuration'

export function createHandleValidateFormula(
  setValidationResult: Dispatch<SetStateAction<ValidateFormulaResponse | null>>,
  validateMutation: ReturnType<typeof useValidateFormulaMutation>,
  formula: string
) {
  return async () => {
    if (!formula.trim()) {
      toast.error('Please enter a formula to validate')
      return
    }

    try {
      const result = await validateMutation.mutateAsync({ formula })
      setValidationResult(result)

      if (result.isValid) {
        toast.success('Formula is valid!')
      } else {
        toast.error(result.error || 'Invalid formula')
      }
    } catch {
      toast.error('Failed to validate formula')
      setValidationResult({ isValid: false, error: 'Failed to validate formula', placeholders: [] })
    }
  }
}
