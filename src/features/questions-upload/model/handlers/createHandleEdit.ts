import type { Dispatch, SetStateAction } from 'react'
import type { Question } from '@/entities/question'
import type { QuestionFormData } from '../types'

export interface HandleEditDeps {
  setEditingQuestion: Dispatch<SetStateAction<Question | null>>
  setFormData: Dispatch<SetStateAction<QuestionFormData>>
  setEditDialogOpen: Dispatch<SetStateAction<boolean>>
}

export function createHandleEdit(deps: HandleEditDeps): (question: Question) => void {
  const { setEditingQuestion, setFormData, setEditDialogOpen } = deps

  return (question: Question) => {
    setEditingQuestion(question)
    setFormData({
      question: question.question,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      answer: question.answer,
    })
    setEditDialogOpen(true)
  }
}
