import { Loader2 } from 'lucide-react'
import { Button } from '@/shared/ui/Button'

interface ImportActionsProps {
  isImporting: boolean
  validSubjectsCount: number
  onCancel: () => void
  onConfirm: () => void
}

export function ImportActions({
  isImporting,
  validSubjectsCount,
  onCancel,
  onConfirm,
}: ImportActionsProps) {
  return (
    <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
      <Button variant="outline" onClick={onCancel} disabled={isImporting}>
        Cancel
      </Button>
      <Button onClick={onConfirm} disabled={isImporting || validSubjectsCount === 0}>
        {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Confirm Import ({validSubjectsCount})
      </Button>
    </div>
  )
}
