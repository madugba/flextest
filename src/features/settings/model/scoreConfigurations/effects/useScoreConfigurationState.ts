import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type {
  PreviewScoreResponse,
  ScoreConfiguration,
  ValidateFormulaResponse,
} from '@/entities/score-configuration'
import { EMPTY_SCORE_FORM, type ScoreFormData } from '../types'

export interface ScoreConfigurationState {
  scoreConfigurations: ScoreConfiguration[]
  setScoreConfigurations: Dispatch<SetStateAction<ScoreConfiguration[]>>
  editingScoreId: string | null
  setEditingScoreId: Dispatch<SetStateAction<string | null>>
  scoreForm: ScoreFormData
  setScoreForm: Dispatch<SetStateAction<ScoreFormData>>
  validationResult: ValidateFormulaResponse | null
  setValidationResult: Dispatch<SetStateAction<ValidateFormulaResponse | null>>
  previewResult: PreviewScoreResponse | null
  setPreviewResult: Dispatch<SetStateAction<PreviewScoreResponse | null>>
  isLoadingScores: boolean
  setIsLoadingScores: Dispatch<SetStateAction<boolean>>
  scoreError: string | null
  setScoreError: Dispatch<SetStateAction<string | null>>
  isValidating: boolean
  setIsValidating: Dispatch<SetStateAction<boolean>>
  isPreviewing: boolean
  setIsPreviewing: Dispatch<SetStateAction<boolean>>
  isCreatingScore: boolean
  setIsCreatingScore: Dispatch<SetStateAction<boolean>>
  isUpdatingScore: boolean
  setIsUpdatingScore: Dispatch<SetStateAction<boolean>>
  isActivatingScore: boolean
  setIsActivatingScore: Dispatch<SetStateAction<boolean>>
  isDeletingScore: boolean
  setIsDeletingScore: Dispatch<SetStateAction<boolean>>
}

export function useScoreConfigurationState(): ScoreConfigurationState {
  const [scoreConfigurations, setScoreConfigurations] = useState<ScoreConfiguration[]>([])
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null)
  const [scoreForm, setScoreForm] = useState<ScoreFormData>({ ...EMPTY_SCORE_FORM })
  const [validationResult, setValidationResult] = useState<ValidateFormulaResponse | null>(null)
  const [previewResult, setPreviewResult] = useState<PreviewScoreResponse | null>(null)
  const [isLoadingScores, setIsLoadingScores] = useState(false)
  const [scoreError, setScoreError] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [isCreatingScore, setIsCreatingScore] = useState(false)
  const [isUpdatingScore, setIsUpdatingScore] = useState(false)
  const [isActivatingScore, setIsActivatingScore] = useState(false)
  const [isDeletingScore, setIsDeletingScore] = useState(false)

  return {
    scoreConfigurations,
    setScoreConfigurations,
    editingScoreId,
    setEditingScoreId,
    scoreForm,
    setScoreForm,
    validationResult,
    setValidationResult,
    previewResult,
    setPreviewResult,
    isLoadingScores,
    setIsLoadingScores,
    scoreError,
    setScoreError,
    isValidating,
    setIsValidating,
    isPreviewing,
    setIsPreviewing,
    isCreatingScore,
    setIsCreatingScore,
    isUpdatingScore,
    setIsUpdatingScore,
    isActivatingScore,
    setIsActivatingScore,
    isDeletingScore,
    setIsDeletingScore,
  }
}
