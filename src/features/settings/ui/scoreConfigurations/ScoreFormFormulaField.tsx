import type { Dispatch, SetStateAction } from 'react'
import type { ValidateFormulaResponse } from '@/entities/score-configuration'
import type { ScoreFormData } from '../../model/scoreConfigurations/types'

interface ScoreFormFormulaFieldProps {
  scoreForm: ScoreFormData
  setScoreForm: Dispatch<SetStateAction<ScoreFormData>>
  validationResult: ValidateFormulaResponse | null
}

export function ScoreFormFormulaField({
  scoreForm,
  setScoreForm,
  validationResult,
}: ScoreFormFormulaFieldProps) {
  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">Formula</label>
      <textarea
        value={scoreForm.formula}
        onChange={(e) => setScoreForm({ ...scoreForm, formula: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
        placeholder="e.g., ({correctAnswers} / {totalQuestions}) * 100"
        rows={3}
        required
      />
      {validationResult && !validationResult.isValid && (
        <p className="text-sm text-red-600 mt-1">{validationResult.error}</p>
      )}
      {validationResult && validationResult.isValid && (
        <p className="text-sm text-green-600 mt-1">Formula is valid!</p>
      )}
    </div>
  )
}
