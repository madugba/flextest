import type { QuestionFormData } from '../types'

export function validateQuestionForm(formData: QuestionFormData): string | null {
  if (!formData.question.trim()) {
    return 'Please enter the question'
  }

  if (
    !formData.optionA.trim() ||
    !formData.optionB.trim() ||
    !formData.optionC.trim() ||
    !formData.optionD.trim()
  ) {
    return 'Please fill in all options'
  }

  if (!formData.answer) {
    return 'Please select the correct answer'
  }

  return null
}
