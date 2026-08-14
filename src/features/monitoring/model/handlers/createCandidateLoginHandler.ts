import type { QueryClient } from '@tanstack/react-query'
import type { SessionMonitoringStats, SessionMonitoringDetails } from '@/entities/monitoring'
import type { CandidateStatus } from '@/entities/candidate'
import type { CandidateLoginEvent } from '@/shared/lib/socket'

export function createCandidateLoginHandler({
  sessionId,
  queryClient,
}: {
  sessionId?: string
  queryClient: QueryClient
}) {
  return (data: CandidateLoginEvent) => {
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
        const existingIndex = oldData.candidates.findIndex((c) => c.id === data.candidate.id)

        let updatedCandidates: typeof oldData.candidates
        if (existingIndex >= 0) {
          updatedCandidates = oldData.candidates.map((c, idx) => {
            if (idx === existingIndex) {
              return {
                id: data.candidate.id,
                firstName: data.candidate.firstName,
                lastName: data.candidate.lastName,
                surname: data.candidate.surname ?? null,
                firstname: data.candidate.firstname ?? null,
                email: data.candidate.email ?? null,
                seatNumber: data.candidate.seatNumber,
                status: data.candidate.status as CandidateStatus,
                lastLoginAt: data.candidate.lastLoginAt ?? null,
                picture: data.candidate.picture ?? null,
                clientInfo: data.candidate.clientInfo,
                subjects: data.candidate.subjects || [],
              }
            }
            return c
          })
        } else {
          updatedCandidates = [
            ...oldData.candidates,
            {
              id: data.candidate.id,
              firstName: data.candidate.firstName,
              lastName: data.candidate.lastName,
              surname: data.candidate.surname ?? null,
              firstname: data.candidate.firstname ?? null,
              email: data.candidate.email ?? null,
              seatNumber: data.candidate.seatNumber,
              status: data.candidate.status as CandidateStatus,
              lastLoginAt: data.candidate.lastLoginAt ?? null,
              picture: data.candidate.picture ?? null,
              clientInfo: data.candidate.clientInfo,
              subjects: data.candidate.subjects || [],
            },
          ]
        }

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
