import { useState } from 'react'
import { createCenter, validateCreateCenter, type CreateCenterRequest } from '@/entities/center'

export function useAddCenter(onSuccess?: () => void) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreateCenterRequest>({
    centerName: '',
    address: '',
    phone: '',
    email: '',
    state: '',
    lga: '',
  })

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
    try {
      setError(null)

      const validationError = validateCreateCenter(formData)
      if (validationError) {
        setError(validationError)
        return
      }

      setIsLoading(true)

      await createCenter(formData)

      handleClose()
      onSuccess?.()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create center')
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
