import type { Dispatch, SetStateAction } from 'react'
import type { ScoringType } from '@/entities/score-configuration'
import type { ScoreFormData } from '../../model/scoreConfigurations/types'

interface ScoreFormBasicFieldsProps {
  scoreForm: ScoreFormData
  setScoreForm: Dispatch<SetStateAction<ScoreFormData>>
}

export function ScoreFormBasicFields({ scoreForm, setScoreForm }: ScoreFormBasicFieldsProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Configuration Name</label>
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
    </>
  )
}
