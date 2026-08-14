'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logoutCandidate } from '@/entities/candidate/api/candidateApi'
import { toast } from 'sonner'

export function useLogoutCandidate(sessionId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ candidateId, reason }: { candidateId: string; reason?: string }) =>
      logoutCandidate(candidateId, reason),
    onSuccess: (data, variables) => {
      toast.success('Candidate logged out successfully', {
        description: data.message,
      })

      if (sessionId) {
        queryClient.invalidateQueries({
          queryKey: ['monitoring', 'session', sessionId, 'statistics'],
        })
        queryClient.invalidateQueries({
          queryKey: ['monitoring', 'session', sessionId, 'details'],
        })

        // Pause the candidate's per-session Redis timer from the examiner side.
        // This is the reliable path — it doesn't depend on the socket event
        // reaching the candidate's browser. The candidate's browser also sends
        // this PATCH on receiving candidate:logout, but the examiner-side pause
        // ensures the timer stops even if the socket is disconnected.
        fetch(`/api/timer/${sessionId}/${variables.candidateId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'pause' }),
        }).catch(() => {})
      }
    },
    onError: (error: Error) => {
      toast.error('Failed to logout candidate', {
        description: error.message || 'An unexpected error occurred',
      })
    },
  })
}
