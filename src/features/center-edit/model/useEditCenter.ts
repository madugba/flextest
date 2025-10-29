import { useState } from 'react'
import { updateCenter, validateUpdateCenter, type Center, type UpdateCenterRequest } from '@/entities/center'

export function useEditCenter(onSuccess?: () => void) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentCenter, setCurrentCenter] = useState<Center | null>(null)
  const [formData, setFormData] = useState<UpdateCenterRequest>({})

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

    try {
      setError(null)

      const validationError = validateUpdateCenter(formData)
      if (validationError) {
        setError(validationError)
        return
      }

      setIsLoading(true)

      await updateCenter(currentCenter.id, formData)

      handleClose()
      onSuccess?.()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update center')
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
