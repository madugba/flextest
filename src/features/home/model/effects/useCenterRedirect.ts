'use client'

import { useEffect } from 'react'

export function useCenterRedirect(checkAndRedirect: () => Promise<void>): void {
  useEffect(() => {
    void checkAndRedirect()
  }, [checkAndRedirect])
}
