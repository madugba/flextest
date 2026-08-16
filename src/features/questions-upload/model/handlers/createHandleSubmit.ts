import type { Dispatch, FormEvent, SetStateAction } from 'react'
import { toast } from 'sonner'
import {
  type AnswerOption,
  type Question,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
} from '@/entities/question'
import { validateQuestionForm } from '../selectors/validateQuestionForm'
import { getResponseErrorMessage } from '../selectors/getResponseErrorMessage'
import type { QuestionFormData } from '../types'

export interface HandleSubmitDeps {
  formData: QuestionFormData
  editingQuestion: Question | null
  subjectId: string
  sessionId: string
  createMutation: ReturnType<typeof useCreateQuestionMutation>
  updateMutation: ReturnType<typeof useUpdateQuestionMutation>
  setEditDialogOpen: Dispatch<SetStateAction<boolean>>
  setActiveTab: Dispatch<SetStateAction<string>>
  resetForm: () => void
}

export function createHandleSubmit(deps: HandleSubmitDeps): (e: FormEvent) => Promise<void> {
  const {
    formData,
    editingQuestion,
    subjectId,
    sessionId,
    createMutation,
    updateMutation,
    setEditDialogOpen,
    setActiveTab,
    resetForm,
  } = deps

  return async (e: FormEvent) => {
    e.preventDefault()

    const validationError = validateQuestionForm(formData)
    if (validationError) {
      toast.error(validationError)
      return
    }

    const payload = {
      question: formData.question,
      optionA: formData.optionA,
      optionB: formData.optionB,
      optionC: formData.optionC,
      optionD: formData.optionD,
      answer: formData.answer as AnswerOption,
      subjectId,
      sessionId,
    }

    try {
      if (editingQuestion) {
        await updateMutation.mutateAsync({ id: editingQuestion.id, data: payload })
        toast.success('Question updated successfully!')
        setEditDialogOpen(false)
      } else {
        await createMutation.mutateAsync(payload)
        toast.success('Question created successfully!')
        setActiveTab('list')
      }

      resetForm()
    } catch (err: unknown) {
      const errorMessage = getResponseErrorMessage(err, 'Failed to save question')
      toast.error(errorMessage)
      console.error('Question save error:', err)
    }
  }
}
