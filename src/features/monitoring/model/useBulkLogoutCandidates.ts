import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bulkLogoutCandidates } from '@/entities/candidate/api/candidateApi'
import { toast } from 'sonner'

/**
 * Mutation hook for logging out multiple candidates from their active sessions
 * Invalidates monitoring queries to refetch updated data
 */
export function useBulkLogoutCandidates(sessionId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ candidateIds, reason }: { candidateIds: string[]; reason?: string }) =>
      bulkLogoutCandidates(candidateIds, reason),
    onSuccess: (data) => {
      const { results } = data

      // Show success toast with summary
      if (results.successful.length > 0 && results.failed.length === 0) {
        toast.success('All candidates logged out successfully', {
          description: `${results.successful.length} candidates were logged out`,
        })
      } else if (results.successful.length > 0 && results.failed.length > 0) {
        toast.warning('Bulk logout partially completed', {
          description: `${results.successful.length} succeeded, ${results.failed.length} failed`,
        })
      } else if (results.failed.length > 0 && results.successful.length === 0) {
        toast.error('Bulk logout failed', {
          description: `Failed to logout ${results.failed.length} candidates`,
        })
      }

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
      toast.error('Failed to perform bulk logout', {
        description: error.message || 'An unexpected error occurred',
      })
    },
  })
}