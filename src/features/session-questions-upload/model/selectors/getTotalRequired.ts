import type { ExamSession } from '@/entities/exam-session'
import type { SubjectQuestionStats } from '../types'

export function getTotalRequired(
  session: ExamSession | null,
  stats: SubjectQuestionStats[]
): number {
  if (!session) {
    return stats.reduce((sum, stat) => sum + stat.required, 0)
  }

  const compulsoryCount = stats.filter((stat) => stat.isCompulsory).length
  const otherSubjectsCount = stats.length - compulsoryCount

  return session.totalCompulsoryQuestion + session.totalOtherQuestions * otherSubjectsCount
}
