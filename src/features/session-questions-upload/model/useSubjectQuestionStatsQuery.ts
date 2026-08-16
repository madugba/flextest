'use client'

import { useQueries } from '@tanstack/react-query'
import { useExamSessionQuery } from '@/entities/exam-session'
import { useSubjectsForSessionQuery } from '@/entities/subject'
import { getQuestionCount } from '@/entities/question'
import { queryKeys } from '@/shared/api/queryKeys'
import type { SubjectQuestionStats } from './types'

export function useSubjectQuestionStatsQuery(sessionId: string | undefined) {
  const subjectsQuery = useSubjectsForSessionQuery(sessionId)
  const sessionQuery = useExamSessionQuery(sessionId)

  const subjects = subjectsQuery.data ?? []
  const session = sessionQuery.data ?? null

  const countQueries = useQueries({
    queries: subjects.map((subject) => ({
      queryKey: queryKeys.questionCount(subject.id, sessionId),
      queryFn: () => getQuestionCount(subject.id, sessionId as string),
      enabled: !!sessionId,
    })),
  })

  const questionStats: SubjectQuestionStats[] = subjects.map((subject, index) => {
    const isCompulsory = subject.id === session?.compulsorySubjectId
    const required = isCompulsory
      ? (session?.totalCompulsoryQuestion ?? 0)
      : (session?.totalOtherQuestions ?? 0)
    return {
      subject,
      uploaded: countQueries[index]?.data?.count ?? 0,
      required,
      isCompulsory,
    }
  })

  const isLoading =
    subjectsQuery.isLoading || sessionQuery.isLoading || countQueries.some((q) => q.isLoading)

  const refetch = async () => {
    await Promise.all([
      subjectsQuery.refetch(),
      sessionQuery.refetch(),
      ...countQueries.map((q) => q.refetch()),
    ])
  }

  return { session, questionStats, isLoading, refetch }
}
