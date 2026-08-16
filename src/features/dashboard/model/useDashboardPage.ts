'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/shared/hooks/useAuth'
import {
  useDashboardMetrics,
  useLastUpdate,
  useMetricsConnection,
  useMetricsStream,
} from '@/features/metrics'

export function useDashboardPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useMetricsStream()

  const { data: metrics, isLoading, isError, error } = useDashboardMetrics()
  const lastUpdate = useLastUpdate()
  const { connected } = useMetricsConnection()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  return { user, authLoading, metrics, isLoading, isError, error, lastUpdate, connected }
}
