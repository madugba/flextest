'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Spinner } from '@/shared/ui/Spinner'
import { getCenters } from '@/shared/api/centerApi'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    async function checkAndRedirect() {
      try {
        const centers = await getCenters()

        // If empty array, redirect to onboarding
        if (centers.length === 0) {
          router.replace('/onboarding')
          return
        }

        // Centers exist, redirect to login
        router.replace('/login')
      } catch (error) {
        console.error(error);
        // Any error, redirect to error page
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        router.push(`/error?message=${encodeURIComponent(errorMessage)}`)
      }
    }

    checkAndRedirect()
  }, [router])

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full opacity-20 blur-3xl animate-pulse animate-delay-1s" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full opacity-10 blur-3xl animate-pulse animate-delay-2s" />
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Logo/Brand area */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Image
              src="/logo-small.png"
              alt="FlexTest"
              width={60}
              height={60}
              className="drop-shadow-lg"
            />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-foreground">FlexTest</h1>
            <p className="text-sm text-muted-foreground">Enterprise-grade platform</p>
          </div>
        </div>

        {/* Loading state */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Spinner />
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-sm animate-pulse" />
          </div>

          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-foreground">Initializing...</p>
            <p className="text-sm text-muted-foreground">Checking system status</p>
          </div>

          {/* Progress indicator */}
          <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full loading-bar loading-bar-width" />
          </div>
        </div>

        {/* Status messages */}
        <div className="flex flex-col items-center space-y-2 text-center max-w-md">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span>Connecting to backend services</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground opacity-50">
            <div className="w-2 h-2 bg-muted-foreground/30 rounded-full" />
            <span>Validating center configuration</span>
          </div>
        </div>
      </div>
    </div>
  )
}
