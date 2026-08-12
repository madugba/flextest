import type { Dispatch, SetStateAction } from 'react'
import type { useRouter } from 'next/navigation'
import { clearCenterCache } from '@/shared/lib'
import type { CenterData } from '../types'

export interface HandleCreateCenterDeps {
  centerData: CenterData | null
  setIsSubmitting: Dispatch<SetStateAction<boolean>>
  setError: Dispatch<SetStateAction<string>>
  router: ReturnType<typeof useRouter>
}

export function createHandleCreateCenter(
  deps: HandleCreateCenterDeps
): () => Promise<void> {
  const { centerData, setIsSubmitting, setError, router } = deps

  return async () => {
    if (!centerData) return

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('http://localhost:3000/api/centers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(centerData),
      })

      if (!response.ok) {
        const errorData: { error?: { message?: string } } = await response.json()
        throw new Error(errorData.error?.message || 'Failed to create center')
      }

      sessionStorage.removeItem('centerData')
      clearCenterCache()
      router.push('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create center')
      setIsSubmitting(false)
    }
  }
}
