import { apiClient } from '@/shared/api/client'
import type { 
  ExamSession, 
  CreateExamSessionRequest, 
  UpdateExamSessionRequest, 
  SessionStatus,
  SessionAnalysis,
  SessionStatistics,
  SessionScores
} from '../model/types'

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

/**
 * Get completed exam sessions only
 * Filters exam sessions by COMPLETED status for reports page
 */
export async function getCompletedExamSessions(): Promise<ExamSession[]> {
  const response = await apiClient.get('/exam-sessions', {
    params: { status: 'COMPLETED' }
  })
  return response.data as ExamSession[]
}

/**
 * Get session analysis with comprehensive statistics
 * Returns score distribution, subject performance, and pass/fail trends
 */
export async function getSessionAnalysis(sessionId: string): Promise<SessionAnalysis> {
  const response = await apiClient.get(`/monitoring/sessions/${sessionId}/analysis`)
  if (!response.data) {
    throw new Error('Failed to fetch session analysis')
  }
  return response.data as SessionAnalysis
}

/**
 * Get session statistics
 * Returns aggregated counts (scheduled, absent, active, submitted)
 */
export async function getSessionStatistics(sessionId: string): Promise<SessionStatistics> {
  const response = await apiClient.get(`/monitoring/sessions/${sessionId}/statistics`)
  if (!response.data) {
    throw new Error('Failed to fetch session statistics')
  }
  
  // Extract statistics from response
  const data = response.data as { statistics: SessionStatistics }
  return data.statistics
}

/**
 * Reschedule exam session
 * Resets session to SCHEDULED status and clears all candidate progress, answers, and results
 */
export async function rescheduleExamSession(id: string): Promise<ExamSession> {
  const response = await apiClient.post(`/exam-sessions/${id}/reschedule`)
  return response.data as ExamSession
}

/**
 * Get session scores per candidate per subject
 * Returns detailed scores calculated using active score configuration
 */
export async function getSessionScores(sessionId: string): Promise<SessionScores> {
  const response = await apiClient.get(`/monitoring/sessions/${sessionId}/scores`)
  if (!response.data) {
    throw new Error('Failed to fetch session scores')
  }
  return response.data as SessionScores
}
