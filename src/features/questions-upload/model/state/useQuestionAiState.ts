import { useState } from 'react'
import type { GeneratedQuestion } from '@/shared/services/ai-generation.service'
import type { AiGenerateFormData } from '../types'

const DEFAULT_AI_FORM: AiGenerateFormData = {
  modelId: '',
  numQuestions: 5,
  difficultyLevel: 'medium',
  extraPrompt: '',
}

export const DEFAULT_AI_GENERATE_FORM = DEFAULT_AI_FORM

export function useQuestionAiState() {
  const [aiGenerateDialogOpen, setAiGenerateDialogOpen] = useState(false)
  const [aiGenerateFormData, setAiGenerateFormData] =
    useState<AiGenerateFormData>(DEFAULT_AI_GENERATE_FORM)
  const [isGenerating, setIsGenerating] = useState(false)

  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([])
  const [isSubmittingGenerated, setIsSubmittingGenerated] = useState(false)

  return {
    aiGenerateDialogOpen,
    setAiGenerateDialogOpen,
    aiGenerateFormData,
    setAiGenerateFormData,
    isGenerating,
    setIsGenerating,
    previewDialogOpen,
    setPreviewDialogOpen,
    generatedQuestions,
    setGeneratedQuestions,
    isSubmittingGenerated,
    setIsSubmittingGenerated,
  }
}
