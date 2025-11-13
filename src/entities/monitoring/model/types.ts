import type { CandidateStatus } from '@/entities/candidate'
import type { SessionStatus } from '@/entities/exam-session'

export interface SessionMonitoringStats {
  sessionId: string
  sessionName: string
  sessionDate: string
  sessionDuration: number
  remainingTime: string
  sessionStatus: SessionStatus
  statistics: {
    scheduled: number
    absent: number
    active: number
    submitted: number
  }
  timestamp: string
}

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

export interface SessionMonitoringDetails extends SessionMonitoringStats {
  candidates: MonitoringCandidate[]
}

export interface SessionControlRequest {
  action: 'start' | 'pause' | 'resume' | 'end'
  reason?: string
}

export interface SessionControlResponse {
  success: boolean
  message: string
  sessionStatus: SessionStatus
}

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
