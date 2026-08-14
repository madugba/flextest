import type { CreateCandidateRequest } from '@/entities/candidate'

export function getSubmitData(
  formData: CreateCandidateRequest,
  selectedSubjects: string[]
): CreateCandidateRequest {
  return {
    ...formData,
    subjects: selectedSubjects,
    email: formData.email?.trim() || undefined,
    othername: formData.othername?.trim() || undefined,
    phone: formData.phone?.trim() || undefined,
    picture: formData.picture?.trim() || undefined,
  }
}
