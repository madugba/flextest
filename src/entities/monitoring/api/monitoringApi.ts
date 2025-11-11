import { apiClient } from '@/shared/api/client'
import type {
  SessionMonitoringStats,
  SessionMonitoringDetails,
  AllSessionsOverview,
  SessionControlRequest,
  SessionControlResponse,
  MonitoringUpdate,
} from '../model/types'

/**
 * Get all sessions overview with statistics
 */
export async function getAllSessionsOverview(): Promise<AllSessionsOverview> {
  const response = await apiClient.get('/monitoring/sessions')
  return response.data as AllSessionsOverview
}

/**
 * Get session monitoring statistics
 */
export async function getSessionStatistics(sessionId: string): Promise<SessionMonitoringStats> {
  const response = await apiClient.get(`/monitoring/sessions/${sessionId}/statistics`)
  return response.data as SessionMonitoringStats
}

/**
 * Get session monitoring details with candidate list
 */
export async function getSessionDetails(sessionId: string): Promise<SessionMonitoringDetails> {
  const response = await apiClient.get(`/monitoring/sessions/${sessionId}`)
  return response.data as SessionMonitoringDetails
}


/**
 * Control session (start, pause, resume, end)
 */
export async function controlSession(
  sessionId: string,
  request: SessionControlRequest
): Promise<SessionControlResponse> {
  const response = await apiClient.post(`/monitoring/sessions/${sessionId}/control`, request)
  return response.data as SessionControlResponse
}

/**
 * Get monitoring update for real-time updates
 */
export async function getMonitoringUpdate(sessionId: string): Promise<MonitoringUpdate> {
  const response = await apiClient.get(`/monitoring/sessions/${sessionId}/update`)
  return response.data as MonitoringUpdate
}

/**
 * Get exam progress for all candidates in a session
 * Used to sync progress on page refresh
 */
export async function getCandidatesProgress(sessionId: string): Promise<Array<{
  candidateId: string
  totalQuestions: number
  totalAttempted: number
}>> {
  const response = await apiClient.get(`/monitoring/sessions/${sessionId}/progress`)
  return response.data as Array<{
    candidateId: string
    totalQuestions: number
    totalAttempted: number
  }>
}
