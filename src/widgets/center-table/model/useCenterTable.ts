import { useState, useEffect } from 'react'
import { getAllCenters, type Center } from '@/entities/center'
import { ApiError } from '@/shared/api/client'

interface UseCenterTableProps {
  refreshTrigger?: number
}

export function useCenterTable(props?: UseCenterTableProps) {
  const { refreshTrigger = 0 } = props || {}
  const [centers, setCenters] = useState<Center[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCenters = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllCenters()
      setCenters(data)
    } catch (err: unknown) {
      if (err instanceof ApiError && err.statusCode === 401) {
        setError('Authentication required. Please login to access center management.')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch centers')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCenters()
  }, [refreshTrigger])

  const refresh = () => {
    fetchCenters()
  }

  return {
    centers,
    loading,
    error,
    refresh,
  }
}
