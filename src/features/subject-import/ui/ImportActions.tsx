'use client'

import { Button } from '@/shared/ui/Button'
import { Loader2 } from 'lucide-react'

interface ImportActionsProps {
  isLoadingSubjects: boolean
  subjectsCount: number
  onReset: () => void
  onCancel: () => void
  onImport: () => void
}

export function ImportActions({
  isLoadingSubjects,
  subjectsCount,
  onReset,
  onCancel,
  onImport,
}: ImportActionsProps) {
  return (
    <div className="flex justify-end gap-2 pt-4 border-t">
      <Button variant="outline" onClick={onReset}>Reset</Button>
      <Button variant="outline" onClick={onCancel}>Cancel</Button>
      <Button onClick={onImport} disabled={subjectsCount === 0 || isLoadingSubjects}>
        {isLoadingSubjects && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Import ({subjectsCount})
      </Button>
    </div>
  )
}
