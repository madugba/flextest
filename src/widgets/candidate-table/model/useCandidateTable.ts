'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  useCandidatesQuery,
  type CandidateFilters,
  type CandidateStatus,
} from '@/entities/candidate'

interface UseCandidateTableProps {
  refreshTrigger?: number
}

export function useCandidateTable(props?: UseCandidateTableProps) {
  const { refreshTrigger = 0 } = props || {}

  const [filters, setFilters] = useState<CandidateFilters>({
    page: 1,
    limit: 20,
    search: '',
    status: undefined,
    sessionId: undefined,
  })

  const validFilters: CandidateFilters = {
    ...filters,
    status:
      filters.status &&
      ['PENDING', 'APPROVED', 'REJECTED', 'SUBMITTED', 'ACTIVE'].includes(filters.status)
        ? filters.status
        : undefined,
  }

  const candidatesQuery = useCandidatesQuery(validFilters)
  const candidates = candidatesQuery.data?.candidates ?? []
  const pagination = candidatesQuery.data?.pagination ?? {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  }
  const loading = candidatesQuery.isLoading
  const error = candidatesQuery.error?.message ?? null

  useEffect(() => {
    if (candidatesQuery.isError) {
      console.error('[candidate-table] fetch failed:', candidatesQuery.error)
    }
  }, [candidatesQuery.isError, candidatesQuery.error])

  const refresh = useCallback(() => {
    void candidatesQuery.refetch()
  }, [candidatesQuery])

  useEffect(() => {
    if (refreshTrigger > 0) {
      void refresh()
    }
  }, [refreshTrigger, refresh])

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }))
  }

  const handleFilterStatus = (status: string | undefined) => {
    const normalizedStatus = status === 'ACTIVATE' ? 'ACTIVE' : status
    const validStatus: CandidateStatus | undefined =
      normalizedStatus &&
      ['PENDING', 'APPROVED', 'REJECTED', 'SUBMITTED', 'ACTIVE'].includes(normalizedStatus)
        ? (normalizedStatus as CandidateStatus)
        : undefined
    setFilters((prev) => ({ ...prev, status: validStatus, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
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
