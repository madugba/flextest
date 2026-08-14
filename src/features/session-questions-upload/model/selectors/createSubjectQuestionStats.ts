import type { ExamSession } from '@/entities/exam-session'
import type { Subject } from '@/entities/subject'
import type { SubjectQuestionStats } from '../types'

export function createSubjectQuestionStats(
  subject: Subject,
  uploadedCount: number,
  session: ExamSession
): SubjectQuestionStats {
  const isCompulsory = subject.id === session.compulsorySubjectId
  const required = isCompulsory ? session.totalCompulsoryQuestion : session.totalOtherQuestions

  return {
    subject,
    uploaded: uploadedCount,
    required,
    isCompulsory,
  }
}
