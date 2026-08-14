import type { Dispatch, SetStateAction } from 'react'
import type { ScoreFormData } from '../../model/scoreConfigurations/types'

interface ScoreFormNegativeMarkingProps {
  scoreForm: ScoreFormData
  setScoreForm: Dispatch<SetStateAction<ScoreFormData>>
}

export function ScoreFormNegativeMarking({
  scoreForm,
  setScoreForm,
}: ScoreFormNegativeMarkingProps) {
  return (
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
  )
}
