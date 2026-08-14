import type { Dispatch, FormEvent, SetStateAction } from 'react'
import type {
  PreviewScoreResponse,
  ScoreConfiguration,
  ScoringType,
  ValidateFormulaResponse,
} from '@/entities/score-configuration'

export interface ScoreFormData {
  name: string
  description: string
  formula: string
  scoringType: ScoringType
  negativeMarking: boolean
  negativeMarkValue: number | undefined
  maxScore: number | undefined
  passingScore: number | undefined
  gradeRanges: Record<string, [number, number]>
}

export const EMPTY_SCORE_FORM: ScoreFormData = {
  name: '',
  description: '',
  formula: '',
  scoringType: 'PERCENTAGE',
  negativeMarking: false,
  negativeMarkValue: undefined,
  maxScore: undefined,
  passingScore: undefined,
  gradeRanges: {},
}

export interface ScoreConfigurationsController {
  scoreConfigurations: ScoreConfiguration[]
  scoreForm: ScoreFormData
  setScoreForm: Dispatch<SetStateAction<ScoreFormData>>
  editingScoreId: string | null
  validationResult: ValidateFormulaResponse | null
  previewResult: PreviewScoreResponse | null
  isLoadingScores: boolean
  scoreError: string | null
  isValidating: boolean
  isPreviewing: boolean
  isCreatingScore: boolean
  isUpdatingScore: boolean
  isActivatingScore: boolean
  isDeletingScore: boolean
  handleCreateScore: (e: FormEvent) => void
  handleUpdateScore: (e: FormEvent) => void
  handleEditScore: (config: ScoreConfiguration) => void
  handleCancelEdit: () => void
  handleDeleteScore: (id: string) => void
  handleActivateScore: (id: string) => void
  handleValidateFormula: () => void
  handlePreviewScore: () => void
  reload: () => void
}
