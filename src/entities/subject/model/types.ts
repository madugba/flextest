/**
 * Subject Entity Types
 */

export interface Subject {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface CreateSubjectRequest {
  name: string
}

export interface UpdateSubjectRequest {
  name?: string
}

export interface ImportSubjectsRequest {
  apiEndpoint: string
}

export interface ImportSubjectsResponse {
  created: number
  skipped: number
  errors: string[]
}

export interface ConfirmImportRequest {
  subjects: Array<{
    name: string
  }>
}

export interface ConfirmImportResponse {
  created: number
  skipped: number
  errors: string[]
}
