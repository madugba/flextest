'use client'

import Link from 'next/link'
import { ErrorDetails, ErrorIcon, RetryButton } from '@/features/error-display'
import { Button } from '@/shared/ui'
import { useErrorPage } from '../model/useErrorPage'
import type { ErrorSearchParams } from '../model/types'

interface ErrorPageProps {
  searchParams?: ErrorSearchParams
}

export function ErrorPage({ searchParams }: ErrorPageProps) {
  const { type, title, description, message, details } = useErrorPage(searchParams)

  return (
    <main
      className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg" role="alert" aria-live="polite">
        <div className="flex flex-col items-center">
          <div className="mb-8">
            <ErrorIcon type={type} />
          </div>

          <div className="text-center space-y-4 mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {title}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed px-4">
              {description}
            </p>
          </div>

          <div className="w-full space-y-3 mb-8">
            <RetryButton />

            <div className="relative flex items-center justify-center gap-3">
              <div className="flex-1 border-t border-border" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Or</span>
              <div className="flex-1 border-t border-border" />
            </div>

            <Button variant="outline" asChild className="w-full" size="lg">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>

          {(message || details) && (
            <div className="w-full mb-8">
              <ErrorDetails message={message} details={details} />
            </div>
          )}

          <div className="w-full pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              Need help?{' '}
              <Link
                href="mailto:support@flex.sch.ng"
                className="text-primary hover:text-primary/80 font-medium transition-colors hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
              >
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
