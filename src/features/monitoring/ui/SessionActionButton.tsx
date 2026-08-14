import type { ReactNode } from 'react'
import { Button } from '@/shared/ui/Button'

interface SessionActionButtonProps {
  variant?: 'default' | 'outline' | 'destructive'
  onClick: () => void
  disabled: boolean
  icon: ReactNode
  children: ReactNode
}

export function SessionActionButton({
  variant = 'default',
  onClick,
  disabled,
  icon,
  children,
}: SessionActionButtonProps) {
  return (
    <Button size="sm" variant={variant} className="gap-2" onClick={onClick} disabled={disabled}>
      {icon}
      {children}
    </Button>
  )
}
