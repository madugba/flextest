import { useMutation, useQueryClient } from '@tanstack/react-query'
import { controlSession } from '../api/monitoringApi'
import type { SessionControlRequest } from '../model/types'

export function useControlSessionMutation(sessionId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: SessionControlRequest) => controlSession(sessionId, request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['monitoring', 'sessions'] })
      void queryClient.invalidateQueries({ queryKey: ['exam-sessions'] })
    },
  })
}
