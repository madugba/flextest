'use client'

import { useState } from 'react'
import { useDeleteCenterMutation, type Center } from '@/entities/center'

export function useDeleteCenter(onSuccess?: () => void) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentCenter, setCurrentCenter] = useState<Center | null>(null)

  const deleteMutation = useDeleteCenterMutation()
  const isLoading = deleteMutation.isPending

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

    setError(null)

    try {
      await deleteMutation.mutateAsync(currentCenter.id)
      handleClose()
      onSuccess?.()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete center')
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
