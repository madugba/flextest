import type { Dispatch, SetStateAction } from 'react'
import type { Question } from '@/entities/question'
import type { QuestionFormData } from '../types'

export interface ResetFormDeps {
  setFormData: Dispatch<SetStateAction<QuestionFormData>>
  setEditingQuestion: Dispatch<SetStateAction<Question | null>>
  setEditDialogOpen: Dispatch<SetStateAction<boolean>>
  setError: Dispatch<SetStateAction<string | null>>
}

export function createResetForm(deps: ResetFormDeps): () => void {
  const { setFormData, setEditingQuestion, setEditDialogOpen, setError } = deps

  return () => {
    setFormData({
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      answer: '',
    })
    setEditingQuestion(null)
    setEditDialogOpen(false)
    setError(null)
  }
}
