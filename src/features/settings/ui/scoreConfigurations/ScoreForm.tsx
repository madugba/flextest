import type { Dispatch, FormEvent, SetStateAction } from 'react'
import type { PreviewScoreResponse, ValidateFormulaResponse } from '@/entities/score-configuration'
import type { ScoreFormData } from '../../model/scoreConfigurations/types'
import { ScoreFormActions } from './ScoreFormActions'
import { ScoreFormBasicFields } from './ScoreFormBasicFields'
import { ScoreFormFormulaField } from './ScoreFormFormulaField'
import { ScoreFormNegativeMarking } from './ScoreFormNegativeMarking'
import { ScoreFormPlaceholders } from './ScoreFormPlaceholders'
import { ScoreFormPreviewResult } from './ScoreFormPreviewResult'
import { ScoreFormScoreFields } from './ScoreFormScoreFields'
import { ScoreFormTemplateSelect } from './ScoreFormTemplateSelect'

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
      <ScoreFormTemplateSelect setScoreForm={setScoreForm} />

      <form onSubmit={editingScoreId ? handleUpdateScore : handleCreateScore}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ScoreFormBasicFields scoreForm={scoreForm} setScoreForm={setScoreForm} />

          <ScoreFormFormulaField
            scoreForm={scoreForm}
            setScoreForm={setScoreForm}
            validationResult={validationResult}
          />

          <ScoreFormPlaceholders scoreForm={scoreForm} setScoreForm={setScoreForm} />

          <ScoreFormScoreFields scoreForm={scoreForm} setScoreForm={setScoreForm} />

          <ScoreFormNegativeMarking scoreForm={scoreForm} setScoreForm={setScoreForm} />

          <ScoreFormActions
            editingScoreId={editingScoreId}
            scoreForm={scoreForm}
            validationResult={validationResult}
            isValidating={isValidating}
            isPreviewing={isPreviewing}
            isSubmitting={isCreatingScore || isUpdatingScore}
            handleValidateFormula={handleValidateFormula}
            handlePreviewScore={handlePreviewScore}
            handleCancelEdit={handleCancelEdit}
          />
        </div>
      </form>

      <ScoreFormPreviewResult previewResult={previewResult} />
    </>
  )
}
