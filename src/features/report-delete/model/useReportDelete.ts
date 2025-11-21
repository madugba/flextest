import { useState } from 'react'
import { deleteExamSession } from '@/entities/exam-session'
import { toast } from 'sonner'

/**
 * Hook for deleting exam session reports
 * Handles delete operation with loading states and error handling
 */
export function useReportDelete(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteReport = async (sessionId: string) => {
    setLoading(true)
    setError(null)

    try {
      await deleteExamSession(sessionId)
      toast.success('Session deleted successfully')
      onSuccess?.()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete session'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    deleteReport,
    loading,
    error,
  }
}

