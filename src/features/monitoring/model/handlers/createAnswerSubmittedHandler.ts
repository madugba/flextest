import type { QueryClient } from '@tanstack/react-query'
import type { SessionMonitoringDetails } from '@/entities/monitoring'
import type { ExamAnswerSubmittedEvent } from '@/shared/lib/socket'
import type { CandidateProgressRef } from '../state/CandidateProgressRef'

export function createAnswerSubmittedHandler({
  sessionId,
  queryClient,
  progressRef,
}: {
  sessionId?: string
  queryClient: QueryClient
  progressRef: CandidateProgressRef
}) {
  return (data: ExamAnswerSubmittedEvent) => {
    if (data.sessionId !== sessionId) {
      return
    }

    progressRef.current.set(data.candidateId, {
      attempted: data.totalAttemptedQuestions,
      totalQuestions: data.totalQuestions,
    })

    queryClient.setQueryData<SessionMonitoringDetails>(
      ['monitoring', 'session', sessionId, 'details'],
      (oldData) => {
        if (!oldData) {
          return oldData
        }
        const updatedCandidates = oldData.candidates.map((c) => {
          if (c.id === data.candidateId) {
            return {
              ...c,
              totalQuestions: data.totalQuestions,
              attempted: data.totalAttemptedQuestions,
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
