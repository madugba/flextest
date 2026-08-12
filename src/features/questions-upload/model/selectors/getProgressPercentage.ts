import type { ExamSession } from '@/entities/exam-session'

export function getProgressPercentage(
  session: ExamSession | null,
  questionCount: number
): number {
  return session ? Math.min(Math.round((questionCount / session.totalQuestion) * 100), 100) : 0
}
