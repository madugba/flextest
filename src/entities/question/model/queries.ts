import { useQuery } from '@tanstack/react-query'
import { getQuestionsBySubjectAndSession, getQuestionCount } from '../api/questionApi'
import { queryKeys } from '@/shared/api/queryKeys'

export function useQuestionsBySubjectAndSessionQuery(
  subjectId: string | undefined,
  sessionId: string | undefined
) {
  return useQuery({
    queryKey: queryKeys.questionsBySubjectAndSession(subjectId ?? '', sessionId ?? ''),
    queryFn: () => getQuestionsBySubjectAndSession(subjectId as string, sessionId as string),
    enabled: !!subjectId && !!sessionId,
  })
}

export function useQuestionCountQuery(
  subjectId: string | undefined,
  sessionId: string | undefined
) {
  return useQuery({
    queryKey: queryKeys.questionCount(subjectId, sessionId),
    queryFn: () => getQuestionCount(subjectId, sessionId),
    enabled: !!subjectId && !!sessionId,
  })
}
