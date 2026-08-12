import type { Subject } from '@/entities/subject'
import type { ExamSession } from '@/entities/exam-session'

export function getRequiredQuestionCount(
  session: ExamSession | null,
  subject: Subject | null
): number {
  return session && subject && session.compulsorySubjectId === subject.id
    ? session.totalCompulsoryQuestion
    : session?.totalOtherQuestions || 0
}
