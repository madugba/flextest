import { useCallback, useEffect, useState } from 'react'
import { getAllAPIConfigurations } from '@/entities/api-configuration'
import type { APIConfiguration } from './types'

/** Loads the saved API configurations used to pick a cohort-fetch / score-push endpoint. */
export function useApiConfigurations(enabled: boolean) {
  const [configurations, setConfigurations] = useState<APIConfiguration[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      setConfigurations(await getAllAPIConfigurations())
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (enabled) load()
  }, [enabled, load])

  return { configurations, isLoading, reload: load }
}
