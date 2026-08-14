import type { Dispatch, FormEvent, SetStateAction } from 'react'
import {
  AVAILABLE_PLACEHOLDERS,
  FORMULA_TEMPLATES,
  type PreviewScoreResponse,
  type ScoringType,
  type ValidateFormulaResponse,
} from '@/entities/score-configuration'
import { applyTemplate } from '../../model/scoreConfigurations/selectors/applyTemplate'
import type { ScoreFormData } from '../../model/scoreConfigurations/types'

interface ScoreFormProps {
  scoreForm: ScoreFormData
  setScoreForm: Dispatch<SetStateAction<ScoreFormData>>
  editingScoreId: string | null
  validationResult: ValidateFormulaResponse | null
  previewResult: PreviewScoreResponse | null
  isValidating: boolean
  isPreviewing: boolean
  isCreatingScore: boolean
  isUpdatingScore: boolean
  handleCreateScore: (e: FormEvent) => void
  handleUpdateScore: (e: FormEvent) => void
  handleValidateFormula: () => void
  handlePreviewScore: () => void
  handleCancelEdit: () => void
}

export function ScoreForm({
  scoreForm,
  setScoreForm,
  editingScoreId,
  validationResult,
  previewResult,
  isValidating,
  isPreviewing,
  isCreatingScore,
  isUpdatingScore,
  handleCreateScore,
  handleUpdateScore,
  handleValidateFormula,
  handlePreviewScore,
  handleCancelEdit,
}: ScoreFormProps) {
  return (
    <>
      {/* Template Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Use Template</label>
        <select
          onChange={(e) => {
            const nextForm = applyTemplate(e.target.value)
            if (nextForm) setScoreForm(nextForm)
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          aria-label="Select formula template"
          title="Select formula template"
        >
          <option value="">Select a template...</option>
          {Object.entries(FORMULA_TEMPLATES).map(([key, template]) => (
            <option key={key} value={key}>
              {template.name} - {template.description}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={editingScoreId ? handleUpdateScore : handleCreateScore}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Configuration Name
            </label>
            <input
              type="text"
              value={scoreForm.name}
              onChange={(e) => setScoreForm({ ...scoreForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Standard Marking"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Scoring Type</label>
            <select
              value={scoreForm.scoringType}
              onChange={(e) =>
                setScoreForm({ ...scoreForm, scoringType: e.target.value as ScoringType })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              aria-label="Select scoring type"
              title="Select scoring type"
            >
              <option value="PERCENTAGE">Percentage</option>
              <option value="POINTS">Points</option>
              <option value="GRADE">Grade</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={scoreForm.description || ''}
              onChange={(e) => setScoreForm({ ...scoreForm, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Description of this scoring configuration"
            />
          </div>

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

          <div className="md:col-span-2">
            <div className="text-sm text-gray-600 mb-2">Available Placeholders:</div>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_PLACEHOLDERS.map((placeholder) => (
                <button
                  key={placeholder.name}
                  type="button"
                  onClick={() => {
                    const cursorPos =
                      (document.querySelector('textarea') as HTMLTextAreaElement)?.selectionStart ||
                      scoreForm.formula.length
                    const newFormula =
                      scoreForm.formula.slice(0, cursorPos) +
                      `{${placeholder.name}}` +
                      scoreForm.formula.slice(cursorPos)
                    setScoreForm({ ...scoreForm, formula: newFormula })
                  }}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-mono"
                  title={placeholder.description}
                >
                  {`{${placeholder.name}}`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Score</label>
            <input
              type="number"
              value={scoreForm.maxScore || ''}
              onChange={(e) =>
                setScoreForm({ ...scoreForm, maxScore: parseInt(e.target.value) || undefined })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passing Score</label>
            <input
              type="number"
              value={scoreForm.passingScore || ''}
              onChange={(e) =>
                setScoreForm({ ...scoreForm, passingScore: parseInt(e.target.value) || undefined })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="40"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={scoreForm.negativeMarking}
                onChange={(e) => setScoreForm({ ...scoreForm, negativeMarking: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Enable Negative Marking</span>
            </label>
            {scoreForm.negativeMarking && (
              <input
                type="number"
                step="0.25"
                value={scoreForm.negativeMarkValue || ''}
                onChange={(e) =>
                  setScoreForm({
                    ...scoreForm,
                    negativeMarkValue: parseFloat(e.target.value) || undefined,
                  })
                }
                className="mt-2 w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="1.0"
              />
            )}
          </div>

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
              disabled={!scoreForm.name || !scoreForm.formula || isCreatingScore || isUpdatingScore}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {editingScoreId
                ? isUpdatingScore
                  ? 'Updating...'
                  : 'Update Configuration'
                : isCreatingScore
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
        </div>
      </form>

      {previewResult && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="font-medium text-blue-900 mb-2">Preview Result</h4>
          <div className="text-sm space-y-1">
            <p>
              <strong>Formula:</strong>{' '}
              <code className="bg-white px-2 py-1 rounded">{previewResult.formula}</code>
            </p>
            <p>
              <strong>Sample Values:</strong>
            </p>
            <ul className="ml-4 list-disc">
              {Object.entries(previewResult.values).map(([key, value]) => (
                <li key={key}>
                  {key}: {value}
                </li>
              ))}
            </ul>
            <p>
              <strong>Result:</strong>{' '}
              <span className="text-lg font-bold text-blue-900">{previewResult.result}</span>
            </p>
            {previewResult.calculation && previewResult.calculation.length > 0 && (
              <>
                <p>
                  <strong>Calculation Steps:</strong>
                </p>
                <ol className="ml-4 list-decimal">
                  {previewResult.calculation.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
