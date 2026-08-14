import type { UpdateCandidateRequest } from '@/entities/candidate'

export function buildUpdateRequest(
  formData: UpdateCandidateRequest,
  selectedSubjects: string[]
): UpdateCandidateRequest {
  return {
    email: formData.email?.trim() || undefined,
    phone: formData.phone?.trim() || undefined,
    isActive: formData.isActive,
    subjects: selectedSubjects,
  }
}
