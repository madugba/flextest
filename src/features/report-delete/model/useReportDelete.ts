'use client'

import { toast } from 'sonner'
import { useDeleteExamSessionMutation } from '@/entities/exam-session'

export function useReportDelete(onSuccess?: () => void) {
  const deleteMutation = useDeleteExamSessionMutation()

  const error = deleteMutation.error?.message ?? null

  const deleteReport = async (sessionId: string) => {
    try {
      await deleteMutation.mutateAsync(sessionId)
      toast.success('Session deleted successfully')
      onSuccess?.()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete session'
      toast.error(errorMessage)
    }
  }

  return {
    deleteReport,
    loading: deleteMutation.isPending,
    error,
  }
}
