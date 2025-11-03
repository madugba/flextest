'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'
import { AuthProvider } from '@/shared/contexts/AuthContext'
import { SocketProvider } from '@/shared/providers/SocketProvider'
import { Toaster } from '@/shared/ui/sonner'

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  })

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider autoConnect={true}>
          {children}
          <Toaster />
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
