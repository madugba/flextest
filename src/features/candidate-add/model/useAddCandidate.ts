'use client'

import { useState } from 'react'
import { useCreateCandidateMutation, type CreateCandidateRequest } from '@/entities/candidate'

export function useAddCandidate(onSuccess?: () => void) {
  const [isOpen, setIsOpen] = useState(false)
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

  const createMutation = useCreateCandidateMutation()

  const isLoading = createMutation.isPending
  const error = createMutation.error?.message ?? null

  const handleOpen = () => {
    setIsOpen(true)
    createMutation.reset()
  }

  const handleClose = () => {
    setIsOpen(false)
    createMutation.reset()
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
    await createMutation.mutateAsync(formData)
    handleClose()
    onSuccess?.()
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
