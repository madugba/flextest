import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logoutCandidate } from '@/entities/candidate/api/candidateApi'
import { toast } from 'sonner'

export function useLogoutCandidate(sessionId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ candidateId, reason }: { candidateId: string; reason?: string }) =>
      logoutCandidate(candidateId, reason),
    onSuccess: (data) => {
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
      }
    },
    onError: (error: Error) => {
      toast.error('Failed to logout candidate', {
        description: error.message || 'An unexpected error occurred',
      })
    },
  })
}
