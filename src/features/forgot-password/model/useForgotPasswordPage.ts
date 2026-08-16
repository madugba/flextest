'use client'

import { useState } from 'react'
import { createHandleSubmit } from './handlers/createHandleSubmit'

export function useForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = createHandleSubmit({ setLoading, setError, setSubmitted })

  return {
    email,
    setEmail,
    submitted,
    setSubmitted,
    loading,
    error,
    handleSubmit,
  }
}
