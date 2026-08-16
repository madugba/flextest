'use client'

import { useCallback, useMemo, useState } from 'react'
import { proxyFetch } from '../lib/proxyFetch'
import { extractCohorts } from '../lib/scorePush'
import type { APIConfiguration, Cohort } from './types'

/** Fetches the cohort/term list for a selected API configuration and tracks the chosen cohort. */
export function useCohortLookup(configurations: APIConfiguration[]) {
  const [cohortApiId, setCohortApiId] = useState('')
  const [cohorts, setCohorts] = useState<Cohort[]>([])
  const [selectedCohortId, setSelectedCohortId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadCohorts = useCallback(async (config: APIConfiguration) => {
    setIsLoading(true)
    setError(null)
    setCohorts([])
    setSelectedCohortId('')
    try {
      const raw = await proxyFetch(config.apiEndpoint, { apiKey: config.apiKey ?? undefined })
      const parsed = extractCohorts(raw)
      if (!parsed.length) throw new Error('No cohorts/terms returned from API')
      setCohorts(parsed)
      setSelectedCohortId(parsed[0].id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cohorts/terms')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const selectCohortApi = useCallback((id: string) => {
    setCohortApiId(id)
    const config = configurations.find((c) => c.id === id)
    if (config) loadCohorts(config)
  }, [configurations, loadCohorts])

  const selectedCohort = useMemo(
    () => cohorts.find((c) => c.id === selectedCohortId) ?? null,
    [cohorts, selectedCohortId]
  )

  const reset = useCallback(() => {
    setCohortApiId('')
    setCohorts([])
    setSelectedCohortId('')
    setError(null)
  }, [])

  return {
    cohortApiId,
    selectCohortApi,
    cohorts,
    isLoading,
    error,
    selectedCohortId,
    setSelectedCohortId,
    selectedCohort,
    reset,
  }
}
