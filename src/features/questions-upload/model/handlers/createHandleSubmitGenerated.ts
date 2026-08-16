import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { useBulkImportQuestionsMutation } from '@/entities/question'
import type { GeneratedQuestion } from '@/shared/services/ai-generation.service'

export interface HandleSubmitGeneratedDeps {
  generatedQuestions: GeneratedQuestion[]
  subjectId: string
  sessionId: string
  importMutation: ReturnType<typeof useBulkImportQuestionsMutation>
  setGeneratedQuestions: Dispatch<SetStateAction<GeneratedQuestion[]>>
  setPreviewDialogOpen: Dispatch<SetStateAction<boolean>>
  setAiGenerateDialogOpen: Dispatch<SetStateAction<boolean>>
}

export function createHandleSubmitGenerated(
  deps: HandleSubmitGeneratedDeps
): () => Promise<void> {
  const {
    generatedQuestions,
    subjectId,
    sessionId,
    importMutation,
    setGeneratedQuestions,
    setPreviewDialogOpen,
    setAiGenerateDialogOpen,
  } = deps

  return async () => {
    if (generatedQuestions.length === 0) {
      toast.error('No questions to submit')
      return
    }

    try {
      const formattedQuestions = generatedQuestions.map((question) => ({
        question: question.question,
        optionA: question.optionA,
        optionB: question.optionB,
        optionC: question.optionC,
        optionD: question.optionD,
        answer: question.answer,
        subjectId,
        sessionId,
      }))

      const result = await importMutation.mutateAsync({
        questions: formattedQuestions,
      })

      toast.success(`Successfully added ${result.success} out of ${result.total} questions!`)

      sessionStorage.setItem('questions-uploaded', sessionId)

      setGeneratedQuestions([])
      setPreviewDialogOpen(false)
      setAiGenerateDialogOpen(false)
    } catch (err: unknown) {
      console.error('[handleSubmitGenerated] Error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit questions'
      toast.error(errorMessage)
    }
  }
}
