export type AnswerOption = 'A' | 'B' | 'C' | 'D'

export interface Question {
  id: string
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  answer: AnswerOption
  subjectId: string
  sessionId: string
  createdAt: string
  updatedAt: string
  subject?: {
    id: string
    name: string
  }
  session?: {
    id: string
    name: string
    date: string
  }
}

export interface CreateQuestionRequest {
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  answer: AnswerOption
  subjectId: string
  sessionId: string
}

export interface UpdateQuestionRequest {
  question?: string
  optionA?: string
  optionB?: string
  optionC?: string
  optionD?: string
  answer?: AnswerOption
  subjectId?: string
  sessionId?: string
}

export interface QuestionPaginationResponse {
  questions: Question[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface QuestionFilters {
  page?: number
  limit?: number
  subjectId?: string
  sessionId?: string
}

export interface BulkImportQuestionsRequest {
  questions: CreateQuestionRequest[]
}

export interface BulkImportQuestionsResponse {
  success: number
  total: number
  message: string
}
