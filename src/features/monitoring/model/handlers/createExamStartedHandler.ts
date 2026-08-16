import type { QueryClient } from '@tanstack/react-query'
import type { SessionMonitoringDetails } from '@/entities/monitoring'
import type { ExamStartedEvent } from '@/shared/lib/socket'
import { queryKeys } from '@/shared/api/queryKeys'
import type { CandidateProgressRef } from '../state/CandidateProgressRef'

export function createExamStartedHandler({
  sessionId,
  queryClient,
  progressRef,
}: {
  sessionId?: string
  queryClient: QueryClient
  progressRef: CandidateProgressRef
}) {
  return (data: ExamStartedEvent) => {
    if (data.sessionId !== sessionId) {
      return
    }

    progressRef.current.set(data.candidateId, {
      attempted: data.totalAttempted,
      totalQuestions: data.totalQuestions,
    })

    queryClient.setQueryData<SessionMonitoringDetails>(
      queryKeys.monitoringSession(sessionId),
      (oldData) => {
        if (!oldData) {
          return oldData
        }
        const updatedCandidates = oldData.candidates.map((c) => {
          if (c.id === data.candidateId) {
            return {
              ...c,
              totalQuestions: data.totalQuestions,
              attempted: data.totalAttempted,
            }
          }
          return c
        })

        return {
          ...oldData,
          candidates: updatedCandidates,
        }
      }
    )
  }
}
