import { useQuery } from '@tanstack/react-query'
import {
  getAllExamSessions,
  getExamSessionById,
  getCompletedExamSessions,
  getSessionAnalysis,
  getSessionStatistics,
  getSessionScores,
} from '../api/examSessionApi'
import type { SessionStatus } from '../model/types'
import { queryKeys } from '@/shared/api/queryKeys'

export function useExamSessionsQuery(status?: SessionStatus) {
  return useQuery({
    queryKey: status ? ['exam-sessions', 'status', status] : queryKeys.examSessions,
    queryFn: () => getAllExamSessions(status),
  })
}

export function useExamSessionQuery(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.examSession(id ?? ''),
    queryFn: () => getExamSessionById(id as string),
    enabled: !!id,
  })
}

export function useCompletedExamSessionsQuery() {
  return useQuery({
    queryKey: queryKeys.completedExamSessions,
    queryFn: () => getCompletedExamSessions(),
  })
}

export function useSessionAnalysisQuery(sessionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.sessionAnalysis(sessionId ?? ''),
    queryFn: () => getSessionAnalysis(sessionId as string),
    enabled: !!sessionId,
  })
}

export function useSessionStatisticsQuery(sessionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.sessionStatistics(sessionId ?? ''),
    queryFn: () => getSessionStatistics(sessionId as string),
    enabled: !!sessionId,
  })
}

export function useSessionScoresQuery(sessionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.sessionScores(sessionId ?? ''),
    queryFn: () => getSessionScores(sessionId as string),
    enabled: !!sessionId,
  })
}
