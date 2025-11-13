'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const defaultStaleTimeMs = 4_000
  const defaultGcTimeMs = 10 * 60 * 1000
  const defaultRetryCount = 1
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: defaultStaleTimeMs,
            gcTime: defaultGcTimeMs,
            refetchOnWindowFocus: false,
            retry: defaultRetryCount,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
