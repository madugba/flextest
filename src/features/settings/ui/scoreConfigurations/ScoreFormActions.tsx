import type { ValidateFormulaResponse } from '@/entities/score-configuration'
import type { ScoreFormData } from '../../model/scoreConfigurations/types'

interface ScoreFormActionsProps {
  editingScoreId: string | null
  scoreForm: ScoreFormData
  validationResult: ValidateFormulaResponse | null
  isValidating: boolean
  isPreviewing: boolean
  isSubmitting: boolean
  handleValidateFormula: () => void
  handlePreviewScore: () => void
  handleCancelEdit: () => void
}

export function ScoreFormActions({
  editingScoreId,
  scoreForm,
  validationResult,
  isValidating,
  isPreviewing,
  isSubmitting,
  handleValidateFormula,
  handlePreviewScore,
  handleCancelEdit,
}: ScoreFormActionsProps) {
  return (
    <div className="md:col-span-2 flex gap-2">
      <button
        type="button"
        onClick={handleValidateFormula}
        disabled={!scoreForm.formula || isValidating}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
      >
        {isValidating ? 'Validating...' : 'Validate Formula'}
      </button>

      <button
        type="button"
        onClick={handlePreviewScore}
        disabled={!scoreForm.formula || !validationResult?.isValid || isPreviewing}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400"
      >
        {isPreviewing ? 'Previewing...' : 'Preview Score'}
      </button>

      <button
        type="submit"
        disabled={!scoreForm.name || !scoreForm.formula || isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {editingScoreId
          ? isSubmitting
            ? 'Updating...'
            : 'Update Configuration'
          : isSubmitting
            ? 'Creating...'
            : 'Create Configuration'}
      </button>

      {editingScoreId && (
        <button
          type="button"
          onClick={handleCancelEdit}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Cancel
        </button>
      )}
    </div>
  )
}
