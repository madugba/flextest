import { useState, useEffect } from 'react'
import { getAllAdmins, type Admin } from '@/entities/admin'
import { ApiError } from '@/shared/api/client'

interface UseAdminTableProps {
  refreshTrigger?: number
}

export function useAdminTable(props?: UseAdminTableProps) {
  const { refreshTrigger = 0 } = props || {}
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllAdmins()
      setAdmins(data)
    } catch (err: unknown) {
      if (err instanceof ApiError && err.statusCode === 401) {
        setError('Authentication required. Please login to access admin management.')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch admins')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [refreshTrigger])

  const refresh = () => {
    fetchAdmins()
  }

  return {
    admins,
    loading,
    error,
    refresh,
  }
}
