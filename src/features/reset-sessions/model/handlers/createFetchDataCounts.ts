import { adminApi } from '@/shared/api/adminApi'
import type { DataCounts } from '../types'

export function createFetchDataCounts(
  setIsLoading: (value: boolean) => void,
  setDataCounts: (counts: DataCounts | null) => void
) {
  return async () => {
    setIsLoading(true)
    try {
      const counts = await adminApi.getResetSessionsPreview()
      setDataCounts({
        sessions: counts.sessions || 0,
        candidates: counts.candidates || 0,
        questions: counts.questions || 0,
        answers: counts.answers || 0,
        results: counts.results || 0,
        lastSession: counts.lastSession || null,
      })
    } catch (error) {
      console.warn('Using fallback data due to error:', error)
      setDataCounts({
        sessions: 0,
        candidates: 0,
        questions: 0,
        answers: 0,
        results: 0,
        lastSession: null,
      })
    } finally {
      setIsLoading(false)
    }
  }
}
