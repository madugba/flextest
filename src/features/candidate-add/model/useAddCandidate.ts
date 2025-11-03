import { useState } from 'react'
import { createCandidate, type CreateCandidateRequest } from '@/entities/candidate'
import { ApiError } from '@/shared/api/client'

export function useAddCandidate(onSuccess?: () => void) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreateCandidateRequest>({
    email: '',
    surname: '',
    firstname: '',
    othername: '',
    phone: '',
    sessionId: '',
    picture: '',
    subjects: [],
  })

  const handleOpen = () => {
    setIsOpen(true)
    setError(null)
  }

  const handleClose = () => {
    setIsOpen(false)
    setError(null)
    setFormData({
      email: '',
      surname: '',
      firstname: '',
      othername: '',
      phone: '',
      sessionId: '',
      picture: '',
      subjects: [],
    })
  }

  const handleSubmit = async () => {
    try {
      setError(null)
      setIsLoading(true)

      await createCandidate(formData)

      handleClose()
      onSuccess?.()
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError(err instanceof Error ? err.message : 'Failed to create candidate')
      }
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
