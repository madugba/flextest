import { useState } from 'react'
import { createAdmin, validateCreateAdmin, type CreateAdminRequest } from '@/entities/admin'

export function useAddAdmin(onSuccess?: () => void) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreateAdminRequest>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  })

  const handleOpen = () => {
    setIsOpen(true)
    setError(null)
  }

  const handleClose = () => {
    setIsOpen(false)
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    })
    setError(null)
  }

  const handleSubmit = async () => {
    try {
      setError(null)

      // Validate
      const validationError = validateCreateAdmin(formData)
      if (validationError) {
        setError(validationError)
        return
      }

      setIsLoading(true)

      await createAdmin(formData)

      handleClose()
      onSuccess?.()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create admin')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isOpen,
    isLoading,
    error,
    formData,
    setFormData,
    handleOpen,
    handleClose,
    handleSubmit,
  }
}
