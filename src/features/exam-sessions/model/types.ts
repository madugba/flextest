export interface ExamSessionFormData {
  name: string
  date: string
  time: string
  duration: string
  hallCapacity: string
  totalQuestion: string
  compulsorySubjectId: string
  totalCompulsoryQuestion: string
  totalOtherQuestions: string
  centerId: string
}

export const EMPTY_EXAM_SESSION_FORM: ExamSessionFormData = {
  name: '',
  date: '',
  time: '',
  duration: '60',
  hallCapacity: '',
  totalQuestion: '',
  compulsorySubjectId: '',
  totalCompulsoryQuestion: '',
  totalOtherQuestions: '',
  centerId: '',
}
