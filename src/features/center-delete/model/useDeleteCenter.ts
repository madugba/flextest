import { useState } from 'react'
import { type Center } from '@/entities/center'
import { apiClient } from '@/shared/api/client'

export function useDeleteCenter(onSuccess?: () => void) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentCenter, setCurrentCenter] = useState<Center | null>(null)

  const handleOpen = (center: Center) => {
    setCurrentCenter(center)
    setIsOpen(true)
    setError(null)
  }

  const handleClose = () => {
    setIsOpen(false)
    setCurrentCenter(null)
    setError(null)
  }

  const handleDelete = async () => {
    if (!currentCenter) return

    try {
      setError(null)
      setIsLoading(true)

      const response = await apiClient.delete(`/centers/${currentCenter.id}`)

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete center')
      }

      handleClose()
      onSuccess?.()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete center')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isOpen,
    isLoading,
    error,
    currentCenter,
    handleOpen,
    handleClose,
    handleDelete,
  }
}
