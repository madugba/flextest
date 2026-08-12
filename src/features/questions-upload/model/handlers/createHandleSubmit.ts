import type { Dispatch, FormEvent, SetStateAction } from 'react'
import { toast } from 'sonner'
import {
  createQuestion,
  updateQuestion,
  type AnswerOption,
  type Question,
} from '@/entities/question'
import type { QuestionFormData } from '../types'

export interface HandleSubmitDeps {
  formData: QuestionFormData
  editingQuestion: Question | null
  subjectId: string
  sessionId: string
  setIsSaving: Dispatch<SetStateAction<boolean>>
  setError: Dispatch<SetStateAction<string | null>>
  setQuestions: Dispatch<SetStateAction<Question[]>>
  setEditDialogOpen: Dispatch<SetStateAction<boolean>>
  setActiveTab: Dispatch<SetStateAction<string>>
  resetForm: () => void
  loadData: (bypassCache?: boolean) => Promise<void>
}

export function createHandleSubmit(
  deps: HandleSubmitDeps
): (e: FormEvent) => Promise<void> {
  const {
    formData,
    editingQuestion,
    subjectId,
    sessionId,
    setIsSaving,
    setError,
    setQuestions,
    setEditDialogOpen,
    setActiveTab,
    resetForm,
    loadData,
  } = deps

  return async (e: FormEvent) => {
    e.preventDefault()

    if (!formData.question.trim()) {
      toast.error('Please enter the question')
      return
    }

    if (
      !formData.optionA.trim() ||
      !formData.optionB.trim() ||
      !formData.optionC.trim() ||
      !formData.optionD.trim()
    ) {
      toast.error('Please fill in all options')
      return
    }

    if (!formData.answer) {
      toast.error('Please select the correct answer')
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      if (editingQuestion) {
        const updated = await updateQuestion(editingQuestion.id, {
          question: formData.question,
          optionA: formData.optionA,
          optionB: formData.optionB,
          optionC: formData.optionC,
          optionD: formData.optionD,
          answer: formData.answer,
          subjectId,
          sessionId,
        })
        setQuestions((prev) => prev.map((q) => (q.id === editingQuestion.id ? updated : q)))
        toast.success('Question updated successfully!')
        setEditDialogOpen(false)
      } else {
        await createQuestion({
          question: formData.question,
          optionA: formData.optionA,
          optionB: formData.optionB,
          optionC: formData.optionC,
          optionD: formData.optionD,
          answer: formData.answer as AnswerOption,
          subjectId,
          sessionId,
        })
        toast.success('Question created successfully!')
        setActiveTab('list')
      }

      resetForm()
      if (!editingQuestion) {
        await loadData(true)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : undefined
      const responseMessage =
        typeof err === 'object' && err !== null && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined
      const errorMessage = message || responseMessage || 'Failed to save question'
      toast.error(errorMessage)
      setError(errorMessage)
      console.error('Question save error:', err)
    } finally {
      setIsSaving(false)
    }
  }
}
