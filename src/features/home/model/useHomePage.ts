'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createCheckAndRedirect } from './handlers/createCheckAndRedirect'
import { useCenterRedirect } from './effects/useCenterRedirect'

export function useHomePage() {
  const router = useRouter()

  const checkAndRedirect = useCallback(() => createCheckAndRedirect(router)(), [router])

  useCenterRedirect(checkAndRedirect)
}
