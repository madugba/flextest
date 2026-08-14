import type { CreateCandidateRequest } from '@/entities/candidate'

export function getValidationError(
  formData: CreateCandidateRequest,
  selectedSubjects: string[]
): string | null {
  if (!formData.surname.trim()) {
    return 'Surname is required'
  }

  if (!formData.firstname.trim()) {
    return 'First name is required'
  }

  if (!formData.sessionId) {
    return 'Please select an exam session'
  }

  if (selectedSubjects.length === 0) {
    return 'Please select at least one subject'
  }

  if (selectedSubjects.length > 6) {
    return 'Maximum of 6 subjects allowed'
  }

  return null
}
