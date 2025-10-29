import { useState } from 'react'
import { blockAdmin, unblockAdmin, type Admin } from '@/entities/admin'

export function useBlockAdmin(onSuccess?: (wasBlocked: boolean) => void) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleToggle = async (admin: Admin) => {
    try {
      setError(null)
      setIsLoading(true)

      const wasBlocked = admin.isActive

      if (wasBlocked) {
        await blockAdmin(admin.id)
      } else {
        await unblockAdmin(admin.id)
      }

      onSuccess?.(wasBlocked)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update admin status')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    handleToggle,
  }
}
