'use client'

import { useState } from 'react'
import { useDeleteAdminMutation, type Admin } from '@/entities/admin'

export function useDeleteAdmin(onSuccess?: () => void) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)

  const deleteMutation = useDeleteAdminMutation()
  const isLoading = deleteMutation.isPending

  const handleOpen = (admin: Admin) => {
    setSelectedAdmin(admin)
    setIsOpen(true)
    setError(null)
  }

  const handleClose = () => {
    setIsOpen(false)
    setSelectedAdmin(null)
    setError(null)
  }

  const handleConfirm = async () => {
    if (!selectedAdmin) return

    setError(null)

    try {
      await deleteMutation.mutateAsync(selectedAdmin.id)
      handleClose()
      onSuccess?.()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete admin')
    }
  }

  return {
    isOpen,
    isLoading,
    error,
    selectedAdmin,
    handleOpen,
    handleClose,
    handleConfirm,
  }
}
