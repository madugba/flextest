import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logoutCandidate } from '@/entities/candidate/api/candidateApi'
import { toast } from 'sonner'

/**
 * Mutation hook for logging out a candidate from their active session
 * Invalidates monitoring queries to refetch updated data
 */
export function useLogoutCandidate(sessionId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ candidateId, reason }: { candidateId: string; reason?: string }) =>
      logoutCandidate(candidateId, reason),
    onSuccess: (data, variables) => {
      // Show success toast
      toast.success('Candidate logged out successfully', {
        description: data.message,
      })

      // Invalidate monitoring queries to refetch updated data
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
      // Show error toast
      toast.error('Failed to logout candidate', {
        description: error.message || 'An unexpected error occurred',
      })
    },
  })
}
