import { apiClient } from '@/shared/api/client'
import type { ExamSession, CreateExamSessionRequest, UpdateExamSessionRequest, SessionStatus } from '../model/types'

/**
 * Get all exam sessions
 */
export async function getAllExamSessions(status?: SessionStatus): Promise<ExamSession[]> {
  const params = status ? { status } : {}
  const response = await apiClient.get('/exam-sessions', { params })
  return response.data as ExamSession[]
}

/**
 * Get exam session by ID
 */
export async function getExamSessionById(id: string): Promise<ExamSession> {
  const response = await apiClient.get(`/exam-sessions/${id}`)
  return response.data as ExamSession
}

/**
 * Create a new exam session
 */
export async function createExamSession(data: CreateExamSessionRequest): Promise<ExamSession> {
  const response = await apiClient.post('/exam-sessions', data)
  return response.data as ExamSession
}

/**
 * Update exam session
 */
export async function updateExamSession(
  id: string,
  data: UpdateExamSessionRequest
): Promise<ExamSession> {
  const response = await apiClient.put(`/exam-sessions/${id}`, data)
  return response.data as ExamSession
}

/**
 * Delete exam session
 */
export async function deleteExamSession(id: string): Promise<void> {
  await apiClient.delete(`/exam-sessions/${id}`)
}

/**
 * Import exam sessions from external API
 */
export async function importExamSessionsFromApi(apiEndpoint: string): Promise<{
  created: number
  skipped: number
  errors: string[]
}> {
  const response = await apiClient.post('/exam-sessions/import/api', { apiEndpoint })
  return response.data as { created: number; skipped: number; errors: string[] }
}
