import type { ExamSession } from '@/entities/exam-session'

export function getActiveSessions(sessions: ExamSession[]): ExamSession[] {
  return sessions.filter(
    session => session.status === 'SCHEDULED' || session.status === 'ACTIVE'
  )
}
