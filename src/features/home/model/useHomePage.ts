'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createCheckAndRedirect } from './handlers/createCheckAndRedirect'

export function useHomePage() {
  const router = useRouter()

  useEffect(() => {
    const checkAndRedirect = createCheckAndRedirect(router)
    void checkAndRedirect()
  }, [router])
}
