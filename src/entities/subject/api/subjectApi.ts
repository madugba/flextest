import { apiClient } from '@/shared/api/client'
import type { Subject, CreateSubjectRequest, UpdateSubjectRequest, ImportSubjectsRequest, ImportSubjectsResponse } from '../model/types'

const BASE_URL = '/subjects'

export async function getAllSubjects(search?: string): Promise<Subject[]> {
  const url = search ? `${BASE_URL}?search=${encodeURIComponent(search)}` : BASE_URL
  const response = await apiClient.get<Subject[]>(url)
  return response.data || []
}

export async function getSubjectById(id: string): Promise<Subject> {
  const response = await apiClient.get<Subject>(`${BASE_URL}/${id}`)
  if (!response.data) {
    throw new Error('Subject not found')
  }
  return response.data
}

export async function getSubjectsForSession(sessionId: string): Promise<Subject[]> {
  const response = await apiClient.get<Subject[]>(`${BASE_URL}/session/${sessionId}`)
  return response.data || []
}

export async function createSubject(data: CreateSubjectRequest): Promise<Subject> {
  const response = await apiClient.post<Subject>(BASE_URL, data)
  console.log('This is a sample response', response)
  if (!response.success) {
    throw new Error('Failed to create subject')
  }
  return response.data as Subject
}

export async function updateSubject(id: string, data: UpdateSubjectRequest): Promise<Subject> {
  const response = await apiClient.patch<Subject>(`${BASE_URL}/${id}`, data)
  if (!response.data) {
    throw new Error('Failed to update subject')
  }
  return response.data
}

export async function deleteSubject(id: string): Promise<void> {
  await apiClient.delete(`${BASE_URL}/${id}`)
}

export async function importSubjectsFromApi(data: ImportSubjectsRequest): Promise<ImportSubjectsResponse> {
  const response = await apiClient.post<ImportSubjectsResponse>(`${BASE_URL}/import/api`, data)
  if (!response.data) {
    throw new Error('Failed to import subjects')
  }
  return response.data
}

export async function importSubjectsFromExcel(file: File): Promise<ImportSubjectsResponse> {
  const formData = new FormData()
  formData.append('file', file)

  // Note: This requires a different implementation for FormData
  // For now, return a placeholder
  throw new Error('Excel import not yet implemented in frontend')
}
