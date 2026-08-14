import type { ExamSession } from '@/entities/exam-session'

export function filterExamSessions(sessions: ExamSession[], search: string): ExamSession[] {
  return sessions.filter((session) =>
    session.name.toLowerCase().includes(search.toLowerCase())
  )
}
