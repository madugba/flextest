import type { QueryClient } from '@tanstack/react-query'
import type { SessionMonitoringStats, SessionMonitoringDetails } from '@/entities/monitoring'
import type { CandidateStatus } from '@/entities/candidate'
import type { CandidateLogoutEvent } from '@/shared/lib/socket'

export function createCandidateLogoutHandler({
  sessionId,
  queryClient,
}: {
  sessionId?: string
  queryClient: QueryClient
}) {
  return (data: CandidateLogoutEvent) => {
    if (data.sessionId !== sessionId) {
      return
    }

    queryClient.setQueryData<SessionMonitoringStats>(
      ['monitoring', 'session', sessionId, 'statistics'],
      (oldData) => {
        if (!oldData) {
          return oldData
        }
        return {
          ...oldData,
          statistics: {
            ...data.statistics,
          },
          timestamp: data.timestamp,
        }
      }
    )

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
              status: 'PENDING' as CandidateStatus,
            }
          }
          return c
        })

        return {
          ...oldData,
          statistics: {
            ...data.statistics,
          },
          candidates: updatedCandidates,
          timestamp: data.timestamp,
        }
      }
    )
  }
}
