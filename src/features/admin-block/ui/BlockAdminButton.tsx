'use client'

import { type Admin } from '@/entities/admin'
import { useBlockAdmin } from '../model/useBlockAdmin'

interface BlockAdminButtonProps {
  admin: Admin
  onSuccess?: (wasBlocked: boolean) => void
  children: (props: { onToggle: () => void; isLoading: boolean }) => React.ReactNode
}

export function BlockAdminButton({ admin, onSuccess, children }: BlockAdminButtonProps) {
  const { isLoading, handleToggle } = useBlockAdmin(onSuccess)

  return <>{children({ onToggle: () => handleToggle(admin), isLoading })}</>
}
