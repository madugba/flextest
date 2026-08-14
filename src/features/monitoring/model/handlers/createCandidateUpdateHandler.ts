import type { QueryClient } from '@tanstack/react-query'
import type { SessionMonitoringDetails } from '@/entities/monitoring'
import type { CandidateStatus } from '@/entities/candidate'
import type { CandidateUpdateData } from '@/shared/lib/socket'

export function createCandidateUpdateHandler({
  sessionId,
  queryClient,
}: {
  sessionId?: string
  queryClient: QueryClient
}) {
  return (data: CandidateUpdateData) => {
    if (data.sessionId && data.sessionId !== sessionId) return

    queryClient.setQueryData<SessionMonitoringDetails>(
      ['monitoring', 'session', sessionId, 'details'],
      (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          candidates: oldData.candidates.map((c) =>
            c.id === data.candidateId
              ? { ...c, status: data.status as CandidateStatus }
              : c
          ),
        }
      }
    )

    // Refetch stats so submitted/active counts update immediately
    void queryClient.invalidateQueries({
      queryKey: ['monitoring', 'session', sessionId, 'statistics'],
    })
  }
}
