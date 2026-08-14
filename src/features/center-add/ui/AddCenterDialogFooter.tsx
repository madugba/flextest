import { Button } from '@/shared/ui/Button'

interface AddCenterDialogFooterProps {
  isLoading: boolean
  onClose: () => void
  onSubmit: () => void
}

export function AddCenterDialogFooter({ isLoading, onClose, onSubmit }: AddCenterDialogFooterProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onClose} disabled={isLoading}>
        Cancel
      </Button>
      <Button onClick={onSubmit} disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Center'}
      </Button>
    </div>
  )
}
