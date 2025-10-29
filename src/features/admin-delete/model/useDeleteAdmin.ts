import { useState } from 'react'
import { deleteAdmin, type Admin } from '@/entities/admin'

export function useDeleteAdmin(onSuccess?: () => void) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)

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

    try {
      setError(null)
      setIsLoading(true)

      await deleteAdmin(selectedAdmin.id)

      handleClose()
      onSuccess?.()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete admin')
    } finally {
      setIsLoading(false)
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
