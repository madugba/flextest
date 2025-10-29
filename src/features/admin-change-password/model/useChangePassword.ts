import { useState } from 'react'
import {
  updateAdminPassword,
  validatePasswordChange,
  type Admin,
  type UpdatePasswordRequest,
} from '@/entities/admin'

export function useChangePassword(onSuccess?: () => void) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [formData, setFormData] = useState<UpdatePasswordRequest>({
    currentPassword: '',
    newPassword: '',
  })

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

    try {
      setError(null)

      // Validate
      const validationError = validatePasswordChange(formData)
      if (validationError) {
        setError(validationError)
        return
      }

      setIsLoading(true)

      await updateAdminPassword(selectedAdmin.id, formData)

      handleClose()
      onSuccess?.()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to change password')
    } finally {
      setIsLoading(false)
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
