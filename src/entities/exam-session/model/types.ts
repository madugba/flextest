/**
 * Exam Session Types
 */

export type SessionStatus = 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'

export interface ExamSession {
  id: string
  name: string
  date: string
  hallCapacity: number
  totalQuestion: number
  totalCompulsorySubject: number
  totalCompulsoryQuestion: number
  totalOtherQuestions: number
  time: string
  duration: number
  status: SessionStatus
  compulsorySubjectId: string | null
  centerId: string | null
  createdAt: string
  updatedAt: string
  center?: {
    id: string
    centerName: string
    state: string
  }
  compulsorySubject?: {
    id: string
    name: string
  }
}

export interface CreateExamSessionRequest {
  name: string
  date: string
  hallCapacity: number
  totalQuestion: number
  totalCompulsorySubject: number
  totalCompulsoryQuestion: number
  totalOtherQuestions: number
  time: string
  duration: number
  status?: SessionStatus
  compulsorySubjectId: string
  centerId?: string
}

export interface UpdateExamSessionRequest {
  name?: string
  date?: string
  hallCapacity?: number
  totalQuestion?: number
  totalCompulsorySubject?: number
  totalCompulsoryQuestion?: number
  totalOtherQuestions?: number
  time?: string
  duration?: number
  status?: SessionStatus
  compulsorySubjectId?: string
  centerId?: string
}
