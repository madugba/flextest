import type { CandidateStatus } from '@/entities/candidate'
import type { SessionStatus } from '@/entities/exam-session'

/**
 * Session Monitoring Statistics
 */
export interface SessionMonitoringStats {
  sessionId: string
  sessionName: string
  sessionDate: string
  sessionDuration: number // in minutes
  sessionStatus: SessionStatus
  remainingTime: string // formatted HH:MM:SS
  statistics: {
    scheduled: number // total candidates
    absent: number // candidates with status PENDING
    active: number // candidates with status ACTIVE
    submitted: number // candidates with status SUBMITTED
  }
  timestamp: string
}

/**
 * Monitoring Candidate Info
 */
export interface MonitoringCandidate {
  id: string
  firstName: string
  lastName: string
  surname: string | null
  firstname: string | null
  email: string | null
  seatNumber: number
  status: CandidateStatus
  lastLoginAt: string | null
  picture: string | null
  clientInfo: string
  subjects: Array<{
    id: string
    name: string
  }>
  totalQuestions?: number
  attempted?: number
}

/**
 * Session Monitoring Details
 */
export interface SessionMonitoringDetails extends SessionMonitoringStats {
  candidates: MonitoringCandidate[]
}

/**
 * Session Control Request
 */
export interface SessionControlRequest {
  action: 'start' | 'pause' | 'resume' | 'end'
  reason?: string
}

/**
 * Session Control Response
 */
export interface SessionControlResponse {
  success: boolean
  message: string
  sessionStatus: SessionStatus
}

/**
 * All Sessions Overview
 */
export interface AllSessionsOverview {
  sessions: Array<{
    id: string
    name: string
    date: string
    status: SessionStatus
    stats: {
      scheduled: number
      absent: number
      active: number
      submitted: number
    }
  }>
  summary: {
    totalSessions: number
    activeSessions: number
    completedSessions: number
    totalCandidates: number
    activeCandidates: number
  }
  timestamp: string
}

/**
 * Monitoring Update (WebSocket)
 */
export interface MonitoringUpdate {
  sessionId: string
  stats: {
    scheduled: number
    absent: number
    active: number
    submitted: number
  }
  recentActivities: Array<{
    candidateId: string
    candidateName: string
    action: 'login' | 'logout' | 'submit' | 'start_exam'
    timestamp: string
  }>
  timestamp: string
}
