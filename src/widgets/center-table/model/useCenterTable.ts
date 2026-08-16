'use client'

import { useCentersQuery } from '@/entities/center'
import { ApiError } from '@/shared/api/client'

interface UseCenterTableProps {
  refreshTrigger?: number
}

export function useCenterTable(props?: UseCenterTableProps) {
  void props

  const centersQuery = useCentersQuery()

  const centers = centersQuery.data ?? []
  const loading = centersQuery.isLoading
  const error =
    centersQuery.error instanceof ApiError && centersQuery.error.statusCode === 401
      ? 'Authentication required. Please login to access center management.'
      : centersQuery.error?.message ?? null

  const refresh = () => {
    void centersQuery.refetch()
  }

  return {
    centers,
    loading,
    error,
    refresh,
  }
}
