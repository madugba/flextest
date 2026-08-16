'use client'

import { useEffect } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { useRouter } from 'next/navigation'
import type { CenterData } from '../types'

export function useLoadCenterData(
  router: ReturnType<typeof useRouter>,
  setCenterData: Dispatch<SetStateAction<CenterData | null>>
): void {
  useEffect(() => {
    const data = sessionStorage.getItem('centerData')
    if (!data) {
      router.push('/onboarding/setup')
      return
    }
    setCenterData(JSON.parse(data))
  }, [router, setCenterData])
}
