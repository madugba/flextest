import { useState } from 'react'
import { importCandidates } from '@/entities/candidate'
import { ApiError } from '@/shared/api/client'

export function useImportCandidates(onSuccess?: (count: number) => void) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [jsonData, setJsonData] = useState('')

  const handleOpen = () => {
    setIsOpen(true)
    setError(null)
  }

  const handleClose = () => {
    setIsOpen(false)
    setError(null)
    setJsonData('')
  }

  const handleSubmit = async () => {
    try {
      setError(null)
      setIsLoading(true)

      // Parse JSON data
      let candidates
      try {
        candidates = JSON.parse(jsonData)
      } catch {
        throw new Error('Invalid JSON format')
      }

      // Validate it's an array
      if (!Array.isArray(candidates)) {
        throw new Error('JSON must be an array of candidates')
      }

      const result = await importCandidates({ candidates })

      handleClose()
      onSuccess?.(result.count)
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError(err instanceof Error ? err.message : 'Failed to import candidates')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isOpen,
    isLoading,
    error,
    jsonData,
    setJsonData,
    handleOpen,
    handleClose,
    handleSubmit,
  }
}
