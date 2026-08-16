'use client'

import { useState } from 'react'
import { useCreateAdminMutation, validateCreateAdmin, type CreateAdminRequest } from '@/entities/admin'

export function useAddAdmin(onSuccess?: () => void) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreateAdminRequest>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  })

  const createMutation = useCreateAdminMutation()
  const isLoading = createMutation.isPending

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
    setError(null)

    const validationError = validateCreateAdmin(formData)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      await createMutation.mutateAsync(formData)
      handleClose()
      onSuccess?.()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create admin')
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
