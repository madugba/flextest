'use client'

import { useState } from 'react'
import { useUpdateCenterMutation, validateUpdateCenter, type Center, type UpdateCenterRequest } from '@/entities/center'

export function useEditCenter(onSuccess?: () => void) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentCenter, setCurrentCenter] = useState<Center | null>(null)
  const [formData, setFormData] = useState<UpdateCenterRequest>({})

  const updateMutation = useUpdateCenterMutation()
  const isLoading = updateMutation.isPending

  const handleOpen = (center: Center) => {
    setCurrentCenter(center)
    setFormData({
      centerName: center.centerName,
      address: center.address,
      phone: center.phone,
      email: center.email,
      state: center.state,
      lga: center.lga,
    })
    setIsOpen(true)
    setError(null)
  }

  const handleClose = () => {
    setIsOpen(false)
    setCurrentCenter(null)
    setFormData({})
    setError(null)
  }

  const handleSubmit = async () => {
    if (!currentCenter) return

    setError(null)

    const validationError = validateUpdateCenter(formData)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      await updateMutation.mutateAsync({ id: currentCenter.id, data: formData })
      handleClose()
      onSuccess?.()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update center')
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
