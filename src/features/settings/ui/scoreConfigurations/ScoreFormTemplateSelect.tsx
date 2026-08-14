import type { Dispatch, SetStateAction } from 'react'
import { FORMULA_TEMPLATES } from '@/entities/score-configuration'
import { applyTemplate } from '../../model/scoreConfigurations/selectors/applyTemplate'
import type { ScoreFormData } from '../../model/scoreConfigurations/types'

interface ScoreFormTemplateSelectProps {
  setScoreForm: Dispatch<SetStateAction<ScoreFormData>>
}

export function ScoreFormTemplateSelect({ setScoreForm }: ScoreFormTemplateSelectProps) {
  return (
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
  )
}
