import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { generateQuestions } from '@/shared/services/ai-generation.service'
import type { GeneratedQuestion } from '@/shared/services/ai-generation.service'
import type { AIModelConfiguration } from '@/entities/ai-model'
import type { Subject } from '@/entities/subject'
import type { AiGenerateFormData } from '../types'

export interface HandleGenerateQuestionsDeps {
  aiGenerateFormData: AiGenerateFormData
  subject: Subject | null
  aiModels: AIModelConfiguration[]
  setIsGenerating: Dispatch<SetStateAction<boolean>>
  setGeneratedQuestions: Dispatch<SetStateAction<GeneratedQuestion[]>>
  setPreviewDialogOpen: Dispatch<SetStateAction<boolean>>
}

export function createHandleGenerateQuestions(
  deps: HandleGenerateQuestionsDeps
): () => Promise<void> {
  const {
    aiGenerateFormData,
    subject,
    aiModels,
    setIsGenerating,
    setGeneratedQuestions,
    setPreviewDialogOpen,
  } = deps

  return async () => {
    if (!aiGenerateFormData.modelId || !subject) {
      toast.error('Please select an AI model')
      return
    }

    const selectedModel = aiModels.find((m) => m.id === aiGenerateFormData.modelId)
    if (!selectedModel) {
      toast.error('Selected model not found')
      return
    }

    try {
      setIsGenerating(true)
      toast.info('Generating questions with AI...')

      const questions = await generateQuestions({
        model: selectedModel,
        subjectName: subject.name,
        difficultyLevel: aiGenerateFormData.difficultyLevel,
        additionalInstructions: aiGenerateFormData.extraPrompt,
        numQuestions: aiGenerateFormData.numQuestions,
      })

      setGeneratedQuestions(questions)
      setPreviewDialogOpen(true)
      toast.success(`Generated ${questions.length} questions!`)
    } catch (err: unknown) {
      console.error('[handleGenerate] Error:', err)
      toast.error((err as Error).message || 'Failed to generate questions')
    } finally {
      setIsGenerating(false)
    }
  }
}
