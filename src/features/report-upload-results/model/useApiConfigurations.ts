'use client'

import { useCallback } from 'react'
import { useAPIConfigurationsQuery } from '@/entities/api-configuration'

/** Loads the saved API configurations used to pick a cohort-fetch / score-push endpoint. */
export function useApiConfigurations(enabled: boolean) {
  const query = useAPIConfigurationsQuery()

  const reload = useCallback(() => {
    void query.refetch()
  }, [query])

  return {
    configurations: enabled ? (query.data ?? []) : [],
    isLoading: query.isLoading,
    reload,
  }
}
