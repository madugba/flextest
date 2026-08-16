'use client'

import { useState } from 'react'
import {
  useUpdateAdminPasswordMutation,
  validatePasswordChange,
  type Admin,
  type UpdatePasswordRequest,
} from '@/entities/admin'

export function useChangePassword(onSuccess?: () => void) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [formData, setFormData] = useState<UpdatePasswordRequest>({
    currentPassword: '',
    newPassword: '',
  })

  const passwordMutation = useUpdateAdminPasswordMutation()
  const isLoading = passwordMutation.isPending

  const handleOpen = (admin: Admin) => {
    setSelectedAdmin(admin)
    setIsOpen(true)
    setError(null)
  }

  const handleClose = () => {
    setIsOpen(false)
    setSelectedAdmin(null)
    setFormData({ currentPassword: '', newPassword: '' })
    setError(null)
  }

  const handleSubmit = async () => {
    if (!selectedAdmin) return

    setError(null)

    const validationError = validatePasswordChange(formData)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      await passwordMutation.mutateAsync({ id: selectedAdmin.id, data: formData })
      handleClose()
      onSuccess?.()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to change password')
    }
  }

  return {
    isOpen,
    isLoading,
    error,
    selectedAdmin,
    formData,
    setFormData,
    handleOpen,
    handleClose,
    handleSubmit,
  }
}
