import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { getSubjectById, type Subject } from '@/entities/subject'
import { getExamSessionById, type ExamSession } from '@/entities/exam-session'
import {
  getQuestionsBySubjectAndSession,
  type Question,
} from '@/entities/question'

export interface LoadDataDeps {
  subjectId: string
  sessionId: string
  setIsLoading: Dispatch<SetStateAction<boolean>>
  setError: Dispatch<SetStateAction<string | null>>
  setSubject: Dispatch<SetStateAction<Subject | null>>
  setSession: Dispatch<SetStateAction<ExamSession | null>>
  setQuestions: Dispatch<SetStateAction<Question[]>>
}

export function createLoadData(deps: LoadDataDeps): (bypassCache?: boolean) => Promise<void> {
  const { subjectId, sessionId, setIsLoading, setError, setSubject, setSession, setQuestions } =
    deps

  return async (bypassCache: boolean = false) => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('[loadData] Starting to load data...', { subjectId, sessionId, bypassCache })

      if (bypassCache) {
        console.log('[loadData] Waiting for cache invalidation...')
        const cacheInvalidationDelayMs = 1_500
        await new Promise((resolve) => setTimeout(resolve, cacheInvalidationDelayMs))
      }

      const [subjectData, sessionData, questionsData] = await Promise.all([
        getSubjectById(subjectId),
        getExamSessionById(sessionId),
        getQuestionsBySubjectAndSession(subjectId, sessionId, bypassCache),
      ])

      console.log('[loadData] Data loaded:', {
        subject: subjectData,
        session: sessionData,
        questions: questionsData,
        questionsIsArray: Array.isArray(questionsData),
        questionsLength: Array.isArray(questionsData) ? questionsData.length : 'N/A',
      })

      setSubject(subjectData)
      setSession(sessionData)

      if (Array.isArray(questionsData)) {
        console.log('[loadData] Setting questions:', questionsData.length, 'items')
        setQuestions(questionsData)

        if (bypassCache && questionsData.length === 0) {
          console.warn('[loadData] Got empty array after cache bypass, retrying in 2 seconds...')
          setTimeout(async () => {
            try {
              console.log('[loadData] Retry attempt...')
              const retryData = await getQuestionsBySubjectAndSession(subjectId, sessionId, true)
              console.log('[loadData] Retry result:', retryData.length, 'questions')
              if (Array.isArray(retryData) && retryData.length > 0) {
                setQuestions(retryData)
                console.log('[loadData] Successfully loaded questions on retry')
              }
            } catch (err) {
              console.error('[loadData] Retry failed:', err)
            }
          }, 2000)
        }
      } else {
        console.warn('[loadData] Questions data is not an array:', questionsData)
        setQuestions([])
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('[loadData] Error:', err)
    } finally {
      setIsLoading(false)
    }
  }
}
