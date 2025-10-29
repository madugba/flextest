'use client'

import { RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/ui'

export function RetryButton() {
  const router = useRouter()

  const handleRetry = () => {
    router.push('/')
    router.refresh()
  }

  return (
    <Button
      onClick={handleRetry}
      className="group w-full"
      size="lg"
    >
      <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
      <span>Try Again</span>
    </Button>
  )
}
