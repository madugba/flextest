import { apiClient } from '@/shared/api/client'
import type {
  Question,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  QuestionPaginationResponse,
  QuestionFilters,
  BulkImportQuestionsRequest,
  BulkImportQuestionsResponse,
} from '../model/types'

const QUESTION_ENDPOINTS = {
  BASE: '/questions',
  BY_ID: (id: string) => `/questions/${id}`,
  IMPORT: '/questions/import',
  COUNT: '/questions/count',
  BY_SUBJECT_SESSION: '/questions/by-subject-session',
} as const

/**
 * Get all questions with pagination and filters
 */
export async function getAllQuestions(
  filters?: QuestionFilters
): Promise<QuestionPaginationResponse> {
  const params = new URLSearchParams()

  if (filters?.page) params.append('page', filters.page.toString())
  if (filters?.limit) params.append('limit', filters.limit.toString())
  if (filters?.subjectId) params.append('subjectId', filters.subjectId)
  if (filters?.sessionId) params.append('sessionId', filters.sessionId)

  const queryString = params.toString()
  const url = queryString ? `${QUESTION_ENDPOINTS.BASE}?${queryString}` : QUESTION_ENDPOINTS.BASE

  const response = await apiClient.get<QuestionPaginationResponse>(url)
  return response.data!
}

/**
 * Get question by ID
 */
export async function getQuestionById(id: string): Promise<Question> {
  const response = await apiClient.get<Question>(QUESTION_ENDPOINTS.BY_ID(id))
  return response.data!
}

/**
 * Create a new question
 */
export async function createQuestion(data: CreateQuestionRequest): Promise<Question> {
  const response = await apiClient.post<Question>(QUESTION_ENDPOINTS.BASE, data)
  return response.data!
}

/**
 * Update question
 */
export async function updateQuestion(
  id: string,
  data: UpdateQuestionRequest
): Promise<Question> {
  const response = await apiClient.patch<Question>(QUESTION_ENDPOINTS.BY_ID(id), data)
  return response.data!
}

/**
 * Delete question
 */
export async function deleteQuestion(id: string): Promise<void> {
  console.log('[deleteQuestion] Deleting question:', id)
  console.log('[deleteQuestion] Endpoint:', QUESTION_ENDPOINTS.BY_ID(id))

  try {
    const response = await apiClient.delete(QUESTION_ENDPOINTS.BY_ID(id))
    console.log('[deleteQuestion] Delete response:', response)
  } catch (error) {
    console.error('[deleteQuestion] Delete failed:', error)
    throw error
  }
}

/**
 * Bulk import questions
 */
export async function bulkImportQuestions(
  data: BulkImportQuestionsRequest
): Promise<BulkImportQuestionsResponse> {
  const response = await apiClient.post<BulkImportQuestionsResponse>(QUESTION_ENDPOINTS.IMPORT, data)
  return response.data!
}

/**
 * Get question count
 */
export async function getQuestionCount(
  subjectId?: string,
  sessionId?: string,
  bypassCache: boolean = false
): Promise<{ count: number }> {
  const params = new URLSearchParams()

  if (subjectId) params.append('subjectId', subjectId)
  if (sessionId) params.append('sessionId', sessionId)

  // Add cache-busting parameter to force fresh data
  if (bypassCache) {
    params.append('_t', Date.now().toString())
  }

  const queryString = params.toString()
  const url = queryString ? `${QUESTION_ENDPOINTS.COUNT}?${queryString}` : QUESTION_ENDPOINTS.COUNT

  const response = await apiClient.get<{ count: number }>(url)
  return response.data!
}

/**
 * Get all questions by subject and session (cached, no pagination)
 */
export async function getQuestionsBySubjectAndSession(
  subjectId: string,
  sessionId: string,
  bypassCache: boolean = false
): Promise<Question[]> {
  const params = new URLSearchParams({
    subjectId,
    sessionId,
  })

  // Add cache-busting parameter to force fresh data
  if (bypassCache) {
    params.append('_t', Date.now().toString())
  }

  const response = await apiClient.get<Question[]>(`${QUESTION_ENDPOINTS.BY_SUBJECT_SESSION}?${params.toString()}`)
  console.log('[getQuestionsBySubjectAndSession] Response:', response)
  console.log('[getQuestionsBySubjectAndSession] Response.data:', response.data)
  console.log('[getQuestionsBySubjectAndSession] Is array?:', Array.isArray(response.data))
  console.log('[getQuestionsBySubjectAndSession] Data type:', typeof response.data)

  // Handle case where data might be undefined or null
  if (!response.data) {
    console.warn('[getQuestionsBySubjectAndSession] Data is null/undefined, returning empty array')
    return []
  }

  // If data is already an array, return it
  if (Array.isArray(response.data)) {
    console.log('[getQuestionsBySubjectAndSession] Data is array, returning:', response.data.length, 'items')
    return response.data
  }

  // If data is an object with numeric keys, convert to array
  if (typeof response.data === 'object') {
    console.warn('[getQuestionsBySubjectAndSession] Data is object, converting to array...')
    const dataArray = Object.values(response.data)
    console.log('[getQuestionsBySubjectAndSession] Converted to array:', dataArray.length, 'items')
    return dataArray as Question[]
  }

  // Fallback: return empty array
  console.error('[getQuestionsBySubjectAndSession] Unexpected data format:', response.data)
  return []
}
