import { useState, useEffect } from 'react'
import { getAllCandidates, type Candidate, type CandidateFilters } from '@/entities/candidate'
import { ApiError } from '@/shared/api/client'

interface UseCandidateTableProps {
  refreshTrigger?: number
}

export function useCandidateTable(props?: UseCandidateTableProps) {
  const { refreshTrigger = 0 } = props || {}

  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })
  const [filters, setFilters] = useState<CandidateFilters>({
    page: 1,
    limit: 20,
    search: '',
    status: undefined,
    sessionId: undefined,
  })

  const fetchCandidates = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await getAllCandidates(filters)

      setCandidates(result.candidates)
      setPagination(result.pagination)
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch candidates')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCandidates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger, filters.page, filters.limit, filters.search, filters.status, filters.sessionId])

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }))
  }

  const handleFilterStatus = (status: string | undefined) => {
    setFilters((prev) => ({ ...prev, status: status as 'PENDING' | 'APPROVED' | 'REJECTED' | undefined, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const refresh = () => {
    fetchCandidates()
  }

  return {
    candidates,
    loading,
    error,
    pagination,
    filters,
    handleSearch,
    handleFilterStatus,
    handlePageChange,
    refresh,
  }
}
