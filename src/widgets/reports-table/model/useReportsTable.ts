import { useState, useEffect, useMemo } from 'react'
import { 
  getCompletedExamSessions, 
  getSessionAnalysis,
  type ExamSession,
  type SessionStatistics 
} from '@/entities/exam-session'
import { toast } from 'sonner'

export interface SessionWithStats extends ExamSession {
  statistics?: SessionStatistics
}

type SortField = 'name' | 'date' | 'passRate'
type SortOrder = 'asc' | 'desc'

interface UseReportsTableProps {
  refreshTrigger?: number
}

export function useReportsTable(props?: UseReportsTableProps) {
  const { refreshTrigger = 0 } = props || {}

  const [sessions, setSessions] = useState<SessionWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortField>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const fetchSessions = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getCompletedExamSessions()

      // Fetch statistics for each session in parallel
      const withStats = await Promise.all(
        data.map(async (session) => {
          try {
            // Get analysis data which includes passPercentage
            const analysis = await getSessionAnalysis(session.id)
            
            // Create statistics from analysis
            const statistics: SessionStatistics = {
              scheduled: analysis.totalCandidates,
              absent: analysis.totalCandidates - analysis.submittedCount,
              submitted: analysis.submittedCount,
              passPercentage: analysis.passingTrend.passPercentage,
              passCount: analysis.passingTrend.pass,
              failCount: analysis.passingTrend.fail,
            }
            
            return { ...session, statistics }
          } catch (err) {
            console.error(`Failed to fetch stats for session ${session.id}:`, err)
            return session
          }
        })
      )

      setSessions(withStats)
    } catch (err) {
      console.error('Error fetching completed sessions:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load reports'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [refreshTrigger])

  // Filter and sort sessions
  const filteredSessions = useMemo(() => {
    let filtered = sessions.filter((session) =>
      session.name.toLowerCase().includes(search.toLowerCase())
    )

    // Sort
    filtered = filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'passRate': {
          const aPassRate = typeof a.statistics?.passPercentage === 'number' ? a.statistics.passPercentage : 0
          const bPassRate = typeof b.statistics?.passPercentage === 'number' ? b.statistics.passPercentage : 0
          comparison = aPassRate - bPassRate
          break
        }
        default:
          comparison = 0
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [sessions, search, sortBy, sortOrder])

  return {
    sessions: filteredSessions,
    loading,
    error,
    search,
    setSearch,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    refetch: fetchSessions,
  }
}

