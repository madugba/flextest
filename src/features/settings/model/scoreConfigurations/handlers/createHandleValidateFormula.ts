import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { validateFormula, type ValidateFormulaResponse } from '@/entities/score-configuration'

export function createHandleValidateFormula(
  setValidationResult: Dispatch<SetStateAction<ValidateFormulaResponse | null>>,
  setIsValidating: Dispatch<SetStateAction<boolean>>,
  formula: string
) {
  return async () => {
    if (!formula.trim()) {
      toast.error('Please enter a formula to validate')
      return
    }

    setIsValidating(true)

    try {
      const result = await validateFormula({ formula })
      setValidationResult(result)

      if (result.isValid) {
        toast.success('Formula is valid!')
      } else {
        toast.error(result.error || 'Invalid formula')
      }
    } catch {
      toast.error('Failed to validate formula')
      setValidationResult({ isValid: false, error: 'Failed to validate formula', placeholders: [] })
    } finally {
      setIsValidating(false)
    }
  }
}
