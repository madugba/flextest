'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createHandleCreateCenter } from './handlers/createHandleCreateCenter'
import type { CenterData } from './types'

export function useOnboardingPreviewPage() {
  const router = useRouter()
  const [centerData, setCenterData] = useState<CenterData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const data = sessionStorage.getItem('centerData')
    if (!data) {
      router.push('/onboarding/setup')
      return
    }
    setCenterData(JSON.parse(data))
  }, [router, setCenterData])

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
