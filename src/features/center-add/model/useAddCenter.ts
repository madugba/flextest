'use client'

import { useState } from 'react'
import { useCreateCenterMutation, validateCreateCenter, type CreateCenterRequest } from '@/entities/center'

export function useAddCenter(onSuccess?: () => void) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreateCenterRequest>({
    centerName: '',
    address: '',
    phone: '',
    email: '',
    state: '',
    lga: '',
  })

  const createMutation = useCreateCenterMutation()
  const isLoading = createMutation.isPending

  const handleOpen = () => {
    setIsOpen(true)
    setError(null)
  }

  const handleClose = () => {
    setIsOpen(false)
    setFormData({
      centerName: '',
      address: '',
      phone: '',
      email: '',
      state: '',
      lga: '',
    })
    setError(null)
  }

  const handleSubmit = async () => {
    setError(null)

    const validationError = validateCreateCenter(formData)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      await createMutation.mutateAsync(formData)
      handleClose()
      onSuccess?.()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create center')
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
