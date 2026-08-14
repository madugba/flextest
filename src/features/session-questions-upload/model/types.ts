import type { Subject } from '@/entities/subject'

export interface SubjectQuestionStats {
  subject: Subject
  uploaded: number
  required: number
  isCompulsory: boolean
}
