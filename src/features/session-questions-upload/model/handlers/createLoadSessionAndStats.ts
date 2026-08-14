import type { Dispatch, SetStateAction } from 'react'
import { getExamSessionById, type ExamSession } from '@/entities/exam-session'
import { getSubjectsForSession } from '@/entities/subject'
import { getQuestionCount } from '@/entities/question'
import { createSubjectQuestionStats } from '../selectors/createSubjectQuestionStats'
import type { SubjectQuestionStats } from '../types'

export interface LoadSessionAndStatsDeps {
  sessionId: string
  setIsLoading: Dispatch<SetStateAction<boolean>>
  setSession: Dispatch<SetStateAction<ExamSession | null>>
  setQuestionStats: Dispatch<SetStateAction<SubjectQuestionStats[]>>
}

export function createLoadSessionAndStats(
  deps: LoadSessionAndStatsDeps
): (bypassCache?: boolean) => Promise<void> {
  const { sessionId, setIsLoading, setSession, setQuestionStats } = deps

  return async (bypassCache: boolean = false) => {
    try {
      setIsLoading(true)

      if (bypassCache) {
        await new Promise((resolve) => setTimeout(resolve, 800))
      }

      const sessionData = await getExamSessionById(sessionId)
      setSession(sessionData)

      const sessionSubjects = await getSubjectsForSession(sessionId)

      const statsPromises = sessionSubjects.map(async (subject) => {
        try {
          const { count } = await getQuestionCount(subject.id, sessionId, bypassCache)
          return createSubjectQuestionStats(subject, count, sessionData)
        } catch (err) {
          console.error(`Failed to get count for subject ${subject.id}:`, err)
          return {
            subject,
            uploaded: 0,
            required: 0,
            isCompulsory: false,
          }
        }
      })

      const stats = await Promise.all(statsPromises)
      setQuestionStats(stats)
    } catch (err) {
      console.error('[loadSessionAndStats] Error:', err)
    } finally {
      setIsLoading(false)
    }
  }
}
