import { DialogFooter } from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/Button'

interface DialogActionsProps {
  isLoading: boolean
  isFetching: boolean
  onClose: () => void
  onSubmit: () => void
}

export function DialogActions({ isLoading, isFetching, onClose, onSubmit }: DialogActionsProps) {
  return (
    <DialogFooter className="mt-6">
      <Button variant="outline" onClick={onClose} disabled={isLoading}>
        Cancel
      </Button>
      <Button onClick={onSubmit} disabled={isLoading || isFetching}>
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </DialogFooter>
  )
}
