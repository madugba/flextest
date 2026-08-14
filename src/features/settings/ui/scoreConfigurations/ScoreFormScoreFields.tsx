import type { Dispatch, SetStateAction } from 'react'
import type { ScoreFormData } from '../../model/scoreConfigurations/types'

interface ScoreFormScoreFieldsProps {
  scoreForm: ScoreFormData
  setScoreForm: Dispatch<SetStateAction<ScoreFormData>>
}

export function ScoreFormScoreFields({ scoreForm, setScoreForm }: ScoreFormScoreFieldsProps) {
  return (
    <>
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
    </>
  )
}
