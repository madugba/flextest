'use client'

import { useState } from 'react'
import { useBlockAdminMutation, useUnblockAdminMutation, type Admin } from '@/entities/admin'

export function useBlockAdmin(onSuccess?: (wasBlocked: boolean) => void) {
  const [error, setError] = useState<string | null>(null)

  const blockMutation = useBlockAdminMutation()
  const unblockMutation = useUnblockAdminMutation()
  const isLoading = blockMutation.isPending || unblockMutation.isPending

  const handleToggle = async (admin: Admin) => {
    try {
      setError(null)

      const wasBlocked = admin.isActive

      if (wasBlocked) {
        await blockMutation.mutateAsync(admin.id)
      } else {
        await unblockMutation.mutateAsync(admin.id)
      }

      onSuccess?.(wasBlocked)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update admin status')
    }
  }

  return {
    isLoading,
    error,
    handleToggle,
  }
}
