'use client'

import { useAdminsQuery } from '@/entities/admin'
import { ApiError } from '@/shared/api/client'

interface UseAdminTableProps {
  refreshTrigger?: number
}

export function useAdminTable(props?: UseAdminTableProps) {
  void props

  const adminsQuery = useAdminsQuery()

  const admins = adminsQuery.data ?? []
  const loading = adminsQuery.isLoading
  const error =
    adminsQuery.error instanceof ApiError && adminsQuery.error.statusCode === 401
      ? 'Authentication required. Please login to access admin management.'
      : adminsQuery.error?.message ?? null

  const refresh = () => {
    void adminsQuery.refetch()
  }

  return {
    admins,
    loading,
    error,
    refresh,
  }
}
