import type { Dispatch, SetStateAction } from 'react'
import { AVAILABLE_PLACEHOLDERS } from '@/entities/score-configuration'
import type { ScoreFormData } from '../../model/scoreConfigurations/types'

interface ScoreFormPlaceholdersProps {
  scoreForm: ScoreFormData
  setScoreForm: Dispatch<SetStateAction<ScoreFormData>>
}

export function ScoreFormPlaceholders({ scoreForm, setScoreForm }: ScoreFormPlaceholdersProps) {
  return (
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
  )
}
