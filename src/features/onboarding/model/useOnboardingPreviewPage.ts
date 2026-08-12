import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLoadCenterData } from './effects/useLoadCenterData'
import { createHandleCreateCenter } from './handlers/createHandleCreateCenter'
import type { CenterData } from './types'

export function useOnboardingPreviewPage() {
  const router = useRouter()
  const [centerData, setCenterData] = useState<CenterData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useLoadCenterData(router, setCenterData)

  const handleSubmit = createHandleCreateCenter({
    centerData,
    setIsSubmitting,
    setError,
    router,
  })

  return {
    centerData,
    isSubmitting,
    error,
    handleSubmit,
  }
}
