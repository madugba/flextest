import type { ReactNode } from 'react'
import { StepCard } from './StepCard'
import type { StepStatus } from '../model/types'

export function ImportSubjectsStep({
  status,
  selectedCount,
  children,
}: {
  status: StepStatus
  selectedCount: number
  children: ReactNode
}) {
  return (
    <StepCard
      number={3}
      title="Select Subjects"
      status={status}
      badge={selectedCount ? `${selectedCount} selected` : undefined}
    >
      {children}
    </StepCard>
  )
}
